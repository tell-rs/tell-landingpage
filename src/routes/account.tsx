import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect, useCallback, useRef } from "react";
import { config } from "../config";

type License = {
  id: string;
  tier: string;
  issued: string;
  expires: string;
  revoked: boolean;
  license_key: string | null;
};

type Profile = {
  workos_user_id: string;
  email: string;
  customer_id: string | null;
  company_name: string | null;
  licenses: License[];
  // True while the caller has an ACTIVE, non-churned subscription (spec 063
  // R-A6). Gates the "Manage subscription" entry point below; a fully-churned
  // customer reports false and no longer sees a permanent Manage button.
  has_billing: boolean;
  // Coarse payment-health (spec 063 R-A3): "active" | "past_due". Additive;
  // absent-defaults to "active".
  payment_status?: string;
  // Whether the subscription is scheduled to cancel at period end (R-A4).
  cancel_at_period_end?: boolean;
  // RFC3339 date the paid period ends when a cancel is scheduled (R-A4).
  plan_ends_at?: string | null;
};

// Effective-tier ordering used to pick the license to display (spec 063 R-D2).
const TIER_RANK: Record<string, number> = {
  enterprise: 5,
  business: 4,
  pro: 3,
  starter: 2, // legacy tier, kept for existing licenses
  free: 1,
};

function tierRank(tier: string): number {
  return TIER_RANK[tier.toLowerCase()] ?? 0;
}

/**
 * Select the license the account page should present (spec 063 R-D2). Matches
 * the provisioning poller's predicate EXACTLY so both agree: the highest
 * effective, non-expired tier that carries a usable `license_key`. Replaces the
 * old `find(!revoked)` which picked the first non-revoked license regardless of
 * expiry/tier/key (showing stale/expired keys or a false "contact support").
 */
function selectActiveLicense(licenses: License[]): License | null {
  const now = Date.now();
  const usable = licenses.filter(
    (l) => !l.revoked && l.license_key && new Date(l.expires).getTime() > now,
  );
  if (usable.length === 0) return null;
  return usable.reduce((best, l) =>
    tierRank(l.tier) > tierRank(best.tier) ? l : best,
  );
}

/** Paid tiers can be renewed via self-serve checkout (or contact). Includes
 * legacy starter, which renews as Pro (it canonicalizes — see renewsViaContact). */
function isRenewable(tier: string): boolean {
  return tierRank(tier) >= tierRank("starter");
}

/**
 * Mirror upgrade.tsx's classifyTier routing for renewals: business and
 * enterprise are never self-serve checkout — they renew via the contact path.
 * Everything else renewable (pro, legacy starter) goes through the Pro
 * checkout; starter canonicalizes to Pro. Previously every non-enterprise
 * renew was hardcoded to the $99 Pro checkout, sending Business holders to
 * the wrong purchase.
 */
function renewsViaContact(tier: string): boolean {
  const t = tier.toLowerCase();
  return t === "enterprise" || t === "business";
}

// Server function to get profile (proxies to tell-platform)
const getProfile = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string }) => input)
  .handler(async ({ data }) => {
    const res = await fetch(`${config.apiUrl}/api/v1/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Session expired");
      }
      throw new Error("Failed to load profile");
    }

    return res.json() as Promise<Profile>;
  });

// Server function to mint a Stripe customer-portal session (spec 062 R4).
// Proxies the caller's bearer to tell-platform, which resolves the customer
// server-side by the authenticated email — no customer id is ever taken from
// the client. `return_url` is built here from the site's own origin (never a
// caller-supplied value) so the customer lands back on the account page after
// managing their subscription. Returns the hosted portal URL to redirect to.
const openBillingPortal = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string }) => input)
  .handler(async ({ data }) => {
    const res = await fetch(`${config.apiUrl}/api/v1/me/billing/portal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ return_url: `${config.siteUrl}/account` }),
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Session expired");
      if (res.status === 409) throw new Error("No active subscription to manage");
      if (res.status === 503) throw new Error("Billing is temporarily unavailable");
      throw new Error("Could not open billing management. Please try again.");
    }

    return res.json() as Promise<{ url?: string }>;
  });

export const Route = createFileRoute("/account")({
  component: AccountPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { pending?: boolean; manage?: boolean } => {
    // Deep-link param (spec 063 R-D3 L1 / R-C5): auto-open the billing portal.
    // Accept both `manage` (landing's own name) and `portal` (the name tell-web's
    // buildManageBillingUrl emits) so the cross-repo deep link works either way.
    const truthy = (v: unknown) => v === "1" || v === "true" || v === true;
    return {
      pending:
        search.pending === "true" || search.pending === true
          ? true
          : undefined,
      manage: truthy(search.manage) || truthy(search.portal) ? true : undefined,
    };
  },
});

const MAX_POLL_ATTEMPTS = 10; // 10 * 3s ≈ 30s cap

function AccountPage() {
  const navigate = useNavigate();
  const { pending, manage } = Route.useSearch();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [polling, setPolling] = useState(pending);
  const [pollFailed, setPollFailed] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  // Poll attempts live in a ref so the cap holds across profile re-renders
  // (spec 063 R-D3 M3) — a state/dep-driven counter reset every tick.
  const attemptsRef = useRef(0);
  const manageTriggered = useRef(false);

  const loadProfile = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate({ to: "/login" });
      return null;
    }

    try {
      const data = await getProfile({ data: { accessToken } });
      return data;
    } catch (err) {
      if (err instanceof Error && err.message === "Session expired") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate({ to: "/login" });
        return null;
      }
      throw err;
    }
  }, [navigate]);

  const handleManageBilling = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }
    setPortalError(null);
    setPortalLoading(true);
    try {
      const { url } = await openBillingPortal({ data: { accessToken } });
      // L3: guard a url-less 200 so the button never sticks on "Opening…".
      if (!url) {
        setPortalError("Could not open billing management. Please try again.");
        setPortalLoading(false);
        return;
      }
      // Redirect the browser to the Stripe-hosted portal. Keep the loading
      // state set — the page is navigating away.
      window.location.href = url;
    } catch (err) {
      if (err instanceof Error && err.message === "Session expired") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate({ to: "/login" });
        return;
      }
      setPortalError(
        err instanceof Error
          ? err.message
          : "Could not open billing management. Please try again.",
      );
      setPortalLoading(false);
    }
  }, [navigate]);

  // Initial load
  useEffect(() => {
    loadProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
          // If a usable license is already present, don't spin the poller.
          if (selectActiveLicense(data.licenses)) setPolling(false);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [loadProfile]);

  // Deep-link: auto-open the billing portal when arriving with `?manage=1`
  // (spec 063 R-D3 L1). Runs once, after the initial load settles.
  useEffect(() => {
    if (!manage || manageTriggered.current) return;
    if (loading || error) return;
    manageTriggered.current = true;
    handleManageBilling();
  }, [manage, loading, error, handleManageBilling]);

  // Poll when pending (waiting for the webhook to fire after payment). The
  // interval is keyed only on `polling`/`loadProfile` — NOT `profile` — so it
  // is not torn down and recreated (resetting attempts) on every setProfile
  // (spec 063 R-D3 M3). The cap now actually holds.
  useEffect(() => {
    if (!polling) return;
    attemptsRef.current = 0;
    setPollFailed(false);

    const interval = setInterval(async () => {
      attemptsRef.current += 1;
      try {
        const data = await loadProfile();
        if (data) {
          setProfile(data);
          if (selectActiveLicense(data.licenses)) {
            setPolling(false);
            clearInterval(interval);
            return;
          }
        }
      } catch {
        // Ignore transient poll errors, keep trying until the cap.
      }
      if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
        setPolling(false);
        setPollFailed(true);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [polling, loadProfile]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate({ to: "/" });
  };

  const copyLicenseKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="px-6 py-3 bg-brand text-white rounded-xl font-semibold"
          >
            Sign In Again
          </button>
        </div>
      </main>
    );
  }

  if (!profile) return null;

  const activeLicense = selectActiveLicense(profile.licenses);
  const pastDue = profile.payment_status === "past_due";
  const scheduledCancel = profile.cancel_at_period_end === true;
  const planEndsLabel = profile.plan_ends_at
    ? new Date(profile.plan_ends_at).toLocaleDateString()
    : null;

  return (
    <main className="min-h-screen px-6 pt-20 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Account</h1>
            <p className="text-sm text-muted">{profile.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-muted hover:text-foreground transition"
          >
            Sign Out
          </button>
        </div>

        {/* Polling Banner */}
        {polling && (
          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <p className="text-sm">Setting up your license... This may take a moment.</p>
          </div>
        )}

        {/* Provisioning failed after the cap (spec 063 R-D3 M3) */}
        {pollFailed && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6">
            <p className="text-sm mb-1 font-medium">
              We couldn’t confirm your license yet.
            </p>
            <p className="text-sm text-muted">
              Payment can take a minute to process. Refresh this page shortly, or{" "}
              <a
                href="mailto:hello@tell.rs"
                className="underline hover:text-foreground"
              >
                contact support
              </a>{" "}
              if it doesn’t appear.
            </p>
          </div>
        )}

        {/* Payment failed (spec 063 R-A3 / R-D2) */}
        {pastDue && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm">
              <span className="font-medium">Your last payment failed.</span>{" "}
              Update your payment method to keep your subscription active.
            </p>
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="shrink-0 px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {portalLoading ? "Opening…" : "Update payment"}
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Email</dt>
              <dd>{profile.email}</dd>
            </div>
            {profile.company_name && (
              <div className="flex justify-between">
                <dt className="text-muted">Company</dt>
                <dd>{profile.company_name}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Customer ID</dt>
              <dd className="font-mono text-xs">{profile.customer_id || "—"}</dd>
            </div>
          </dl>
        </div>

        {/* License Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4">License</h2>

          {activeLicense ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeLicense.tier === "enterprise"
                      ? "bg-purple-500/10 text-purple-500"
                      : activeLicense.tier === "business"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : activeLicense.tier === "pro"
                      ? "bg-brand/10 text-brand"
                      : activeLicense.tier === "starter"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-zinc-500/10 text-muted-foreground"
                  }`}
                >
                  {activeLicense.tier.toUpperCase()}
                </span>
                <span className="text-sm text-muted">
                  Expires {new Date(activeLicense.expires).toLocaleDateString()}
                </span>
                {/* Actionable renew (spec 063 R-D5 L8): pre-load checkout for
                    self-serve tiers, or the contact path for Business and
                    Enterprise — matching upgrade.tsx's classifyTier routing. */}
                {isRenewable(activeLicense.tier) &&
                  (renewsViaContact(activeLicense.tier) ? (
                    <Link
                      to="/contact"
                      className="ml-auto text-xs px-3 py-1 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition font-medium"
                    >
                      Renew
                    </Link>
                  ) : (
                    <Link
                      to="/upgrade"
                      search={{ tier: "pro" }}
                      className="ml-auto text-xs px-3 py-1 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition font-medium"
                    >
                      Renew
                    </Link>
                  ))}
              </div>

              {/* License Key Display */}
              {activeLicense.license_key ? (
                <div className="mt-4 p-4 rounded-xl bg-surface border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">License Key</span>
                    <button
                      onClick={() => copyLicenseKey(activeLicense.license_key!)}
                      className="text-xs px-3 py-1 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition font-medium"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <code className="block text-xs font-mono break-all text-muted leading-relaxed select-all">
                    {activeLicense.license_key}
                  </code>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-xl bg-surface text-sm">
                  <p className="text-muted">
                    License key not available.{" "}
                    <a href="mailto:hello@tell.rs" className="underline hover:text-foreground">
                      Contact support
                    </a>
                  </p>
                </div>
              )}

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">License ID</dt>
                  <dd className="font-mono text-xs">{activeLicense.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Issued</dt>
                  <dd>{new Date(activeLicense.issued).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Expires</dt>
                  <dd>{new Date(activeLicense.expires).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted mb-4">No active license</p>
              <Link
                to="/signup"
                className="inline-block px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition"
              >
                Get a License
              </Link>
            </div>
          )}
        </div>

        {/* Billing — only for users with an active billing relationship */}
        {profile.has_billing && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h2 className="font-semibold mb-2">Billing</h2>
            {/* Scheduled cancellation notice (spec 063 R-A4 / R-D2) */}
            {scheduledCancel && (
              <p className="text-sm mb-4 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {planEndsLabel
                  ? `Your plan is scheduled to end on ${planEndsLabel}, then moves to Free. Reactivate anytime below.`
                  : "Your plan is scheduled to cancel at the end of the period. Reactivate anytime below."}
              </p>
            )}
            <p className="text-sm text-muted mb-4">
              Update your payment method, change plan, view invoices, or cancel
              your subscription in the Stripe customer portal.
            </p>
            {portalError && (
              <p className="text-sm text-red-500 mb-3">{portalError}</p>
            )}
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {portalLoading
                ? "Opening…"
                : scheduledCancel
                ? "Reactivate subscription"
                : "Manage subscription"}
            </button>
          </div>
        )}

        {/* All Licenses */}
        {profile.licenses.length > 1 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-semibold mb-4">License History</h2>
            <div className="space-y-3">
              {profile.licenses.map((license) => (
                <div
                  key={license.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    license.revoked ? "bg-surface/50 opacity-60" : "bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        license.revoked
                          ? "bg-red-500/10 text-red-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {license.revoked ? "Revoked" : "Active"}
                    </span>
                    <span className="text-sm">{license.tier}</span>
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(license.issued).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/download" className="text-muted hover:text-foreground transition">
            Download Tell
          </Link>
          <span className="text-border">&bull;</span>
          <a
            href="mailto:hello@tell.rs"
            className="text-muted hover:text-foreground transition"
          >
            Support
          </a>
        </div>
      </div>
    </main>
  );
}

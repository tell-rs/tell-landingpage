// Deep-linkable upgrade route (spec 060 R3; hardened in spec 063 R-D1).
//
// A tell-rs / tell-web upgrade CTA lands here with `?slug&tier&return`.
// Malformed params are dropped at validation; the `return` target is only
// honored when it points at an allowlisted origin (open-redirect guard,
// enforced server-side in createCheckoutSession). If the visitor is not logged
// in, the existing magic-link flow runs inline so the upgrade params survive.
//
// Checkout guards (spec 063 R-D1, defense-in-depth — the server backstop lives
// in checkout.ts):
//   - C1: before starting checkout we fetch `/me`; a customer who already has
//     an active subscription (`has_billing`) is sent to the customer portal,
//     never a second checkout.
//   - H1: `tier=enterprise` (or any non-sellable tier) is NEVER coerced into a
//     charged Pro checkout — enterprise routes to `/contact` (matching the
//     server-authored enterprise URL from R-B1); an unknown tier shows a clear
//     message.
//   - M6: the Stripe customer is bound server-side from the authed session
//     (checkout.ts), so the buyer cannot rebind the purchase to another email.
//     The client no longer passes a `customer` id (L6).

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { sendMagicLink, verifyCode } from "../auth";
import {
  createCheckoutSession,
  getBillingStatus,
  isCheckoutTier,
  isValidSlug,
  openCustomerPortal,
  type CheckoutTier,
} from "../checkout";

type UpgradeSearch = {
  slug?: string;
  /** Raw requested tier; classified into checkout/enterprise/unknown at mount.
   * A missing tier defaults to the sellable Pro tier (the bare `/upgrade` Pro
   * CTA); a non-sellable value is preserved so it is NOT coerced to Pro. */
  tier: string;
  return?: string;
};

const TIER_LABELS: Record<CheckoutTier, string> = {
  pro: "Pro, billed monthly",
  "pro-yearly": "Pro, billed annually",
};

export const Route = createFileRoute("/upgrade")({
  component: UpgradePage,
  validateSearch: (search: Record<string, unknown>): UpgradeSearch => ({
    slug:
      typeof search.slug === "string" && isValidSlug(search.slug)
        ? search.slug
        : undefined,
    // Preserve the raw tier (capped) so enterprise/unknown are not silently
    // coerced to Pro (spec 063 R-D1 H1). A missing tier means the bare Pro CTA.
    tier:
      typeof search.tier === "string" && search.tier.length > 0
        ? search.tier.slice(0, 32)
        : "pro",
    return: typeof search.return === "string" ? search.return : undefined,
  }),
});

type Phase =
  | "checking"
  | "login-email"
  | "login-code"
  | "redirecting"
  | "unavailable";

/** Classify the requested tier into an action. Business (self-hosted, sized
 * by company) is not self-serve checkout either — it routes to contact, the
 * same path as Enterprise, never to an unknown-tier error. */
function classifyTier(tier: string): "checkout" | "enterprise" | "unknown" {
  if (isCheckoutTier(tier)) return "checkout";
  if (tier === "enterprise" || tier === "business") return "enterprise";
  return "unknown";
}

function UpgradePage() {
  const navigate = useNavigate();
  const { slug, tier, return: returnUrl } = Route.useSearch();
  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const tierLabel = isCheckoutTier(tier) ? TIER_LABELS[tier] : tier;

  // Send an already-subscribed customer to the portal (or the account page if
  // the portal could not be minted) instead of starting a second checkout.
  const redirectToManage = useCallback(
    async (accessToken: string) => {
      const { url } = await openCustomerPortal({ data: { accessToken } });
      if (url) {
        window.location.href = url;
      } else {
        navigate({ to: "/account" });
      }
    },
    [navigate],
  );

  const startCheckout = useCallback(
    async (accessToken: string) => {
      setPhase("redirecting");
      setError(null);
      try {
        const result = await createCheckoutSession({
          data: { accessToken, tier, slug, returnUrl },
        });
        // Server backstop diverted an already-subscribed customer to Manage.
        if (result.redirect === "manage") {
          if (result.url) {
            window.location.href = result.url;
          } else {
            navigate({ to: "/account" });
          }
          return;
        }
        if (!result.url) {
          setError("Could not start checkout. Please try again.");
          setPhase("login-email");
          return;
        }
        window.location.href = result.url;
      } catch (err) {
        if (err instanceof Error && err.message === "Session expired") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setPhase("login-email");
          return;
        }
        setError(err instanceof Error ? err.message : "Something went wrong");
        setPhase("login-email");
      }
    },
    [tier, slug, returnUrl, navigate],
  );

  // On mount: route non-sellable tiers away from checkout; for a sellable tier,
  // start checkout when logged in (after the has_billing guard) or log in first.
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const kind = classifyTier(tier);
    if (kind === "enterprise") {
      // Enterprise is never a self-serve checkout — steer to contact.
      navigate({ to: "/contact" });
      return;
    }
    if (kind === "unknown") {
      setError(
        "That plan isn’t available for self-serve checkout. See our pricing or contact us.",
      );
      setPhase("unavailable");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setPhase("login-email");
      return;
    }

    // C1 UI guard: an already-subscribed customer goes to Manage, not checkout.
    (async () => {
      try {
        const { has_billing } = await getBillingStatus({ data: { accessToken } });
        if (has_billing) {
          await redirectToManage(accessToken);
          return;
        }
      } catch (err) {
        if (err instanceof Error && err.message === "Session expired") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setPhase("login-email");
          return;
        }
        // Non-fatal: fall through to checkout; the server backstop re-checks.
      }
      await startCheckout(accessToken);
    })();
  }, [tier, navigate, redirectToManage, startCheckout]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendMagicLink({ data: { email } });
      setPhase("login-code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await verifyCode({ data: { email, code } });
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);
      await startCheckout(result.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition";

  if (phase === "checking" || phase === "redirecting") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
        <div className="text-center">
          <div className="w-6 h-6 mx-auto mb-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted">
            {phase === "redirecting"
              ? "Taking you to secure checkout..."
              : "Loading..."}
          </p>
        </div>
      </main>
    );
  }

  if (phase === "unavailable") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Plan not available
            </h1>
            <p className="text-sm text-muted mb-6">
              {error ?? "That plan isn’t available for self-serve checkout."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/pricing"
                className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition"
              >
                See pricing
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-surface text-foreground rounded-xl font-semibold hover:bg-surface/80 transition border border-border"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {phase === "login-email" ? "Upgrade to Pro" : "Check your email"}
            </h1>
            <p className="text-sm text-muted">
              {phase === "login-email"
                ? "Sign in to continue to checkout"
                : `We sent a code to ${email}`}
            </p>
          </div>

          {/* Upgrade summary */}
          <div className="mb-6 p-4 rounded-xl bg-surface border border-border text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Plan</span>
              <span>{tierLabel}</span>
            </div>
            {slug && (
              <div className="flex justify-between">
                <span className="text-muted">Workspace</span>
                <span className="font-mono text-xs">{slug}</span>
              </div>
            )}
          </div>

          {phase === "login-email" ? (
            <form onSubmit={handleSendLink} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@company.com"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Login Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-1.5">
                  Enter the 6-digit code
                </label>
                <input
                  type="text"
                  id="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`${inputClass} text-center text-lg tracking-widest`}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full h-12 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Continue to Checkout"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhase("login-email");
                  setCode("");
                  setError(null);
                }}
                className="w-full text-sm text-muted hover:text-foreground transition"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Questions about plans?{" "}
          <Link to="/pricing" className="underline hover:text-muted transition">
            See pricing
          </Link>
        </p>
      </div>
    </main>
  );
}

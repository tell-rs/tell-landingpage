import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect, useCallback } from "react";
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
};

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

export const Route = createFileRoute("/account")({
  component: AccountPage,
  validateSearch: (search: Record<string, unknown>) => ({
    pending: search.pending === "true" || search.pending === true,
  }),
});

function AccountPage() {
  const navigate = useNavigate();
  const { pending } = Route.useSearch();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [polling, setPolling] = useState(pending);

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

  // Initial load
  useEffect(() => {
    loadProfile()
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [loadProfile]);

  // Poll when pending (waiting for webhook to fire after payment)
  useEffect(() => {
    if (!polling || !profile) return;

    const activeLicense = profile.licenses.find((l) => !l.revoked && l.license_key);
    if (activeLicense) {
      setPolling(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10; // 10 * 3s = 30s max
    const interval = setInterval(async () => {
      attempts++;
      try {
        const data = await loadProfile();
        if (data) {
          setProfile(data);
          const found = data.licenses.find((l) => !l.revoked && l.license_key);
          if (found || attempts >= maxAttempts) {
            setPolling(false);
            clearInterval(interval);
          }
        }
      } catch {
        // Ignore poll errors, keep trying
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [polling, profile, loadProfile]);

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

  const activeLicense = profile.licenses.find((l) => !l.revoked);

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
              <dd className="font-mono text-xs">{profile.customer_id || "\u2014"}</dd>
            </div>
          </dl>
        </div>

        {/* License Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4">License</h2>

          {activeLicense ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeLicense.tier === "enterprise"
                      ? "bg-purple-500/10 text-purple-500"
                      : activeLicense.tier === "pro"
                      ? "bg-brand/10 text-brand"
                      : activeLicense.tier === "starter"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-zinc-500/10 text-zinc-500"
                  }`}
                >
                  {activeLicense.tier.toUpperCase()}
                </span>
                <span className="text-sm text-muted">
                  Expires {new Date(activeLicense.expires).toLocaleDateString()}
                </span>
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
          <a
            href="https://github.com/tell-rs/tell#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition"
          >
            Documentation
          </a>
          <span className="text-border">&bull;</span>
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

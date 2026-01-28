import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { config } from "../config";

type License = {
  id: string;
  tier: string;
  issued: string;
  expires: string;
  revoked: boolean;
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
});

function AccountPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        navigate({ to: "/login" });
        return;
      }

      try {
        const data = await getProfile({ data: { accessToken } });
        setProfile(data);
      } catch (err) {
        if (err instanceof Error && err.message === "Session expired") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate({ to: "/login" });
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate({ to: "/" });
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
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeLicense.tier === "enterprise"
                      ? "bg-purple-500/10 text-purple-500"
                      : activeLicense.tier === "pro"
                      ? "bg-brand/10 text-brand"
                      : "bg-zinc-500/10 text-zinc-500"
                  }`}
                >
                  {activeLicense.tier.toUpperCase()}
                </span>
                <span className="text-sm text-muted">
                  Expires {new Date(activeLicense.expires).toLocaleDateString()}
                </span>
              </div>

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

              {/* License Key Notice */}
              <div className="mt-4 p-4 rounded-xl bg-surface text-sm">
                <p className="text-muted">
                  Your license key was sent to your email when you signed up.
                  Can't find it?{" "}
                  <a href="mailto:hello@tell.rs" className="underline hover:text-foreground">
                    Contact support
                  </a>
                </p>
              </div>
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
          <span className="text-border">•</span>
          <Link to="/download" className="text-muted hover:text-foreground transition">
            Download Tell
          </Link>
          <span className="text-border">•</span>
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

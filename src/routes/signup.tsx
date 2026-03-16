import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { config } from "../config";

type SignupData = {
  email: string;
  company_name: string;
  role: string;
  company_type: string;
  revenue_band: string;
};

// Server function to call tell-platform API
// This runs on Vercel's server, not in the browser - API key is never exposed
const submitSignup = createServerFn({ method: "POST" })
  .inputValidator((input: SignupData) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.PLATFORM_API_KEY;
    if (!apiKey) {
      throw new Error("Server configuration error");
    }

    const res = await fetch(`${config.apiUrl}/api/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Signup failed" }));
      throw new Error(error.error || "Signup failed");
    }

    return res.json();
  });

// Server function to generate a free license key for self-hosted
const generateLicense = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; company_name: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.PLATFORM_API_KEY;
    if (!apiKey) {
      throw new Error("Server configuration error");
    }

    const res = await fetch(`${config.apiUrl}/api/v1/licenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: data.email,
        customer_name: data.company_name,
        company_name: data.company_name,
        tier: "free",
        months: 12,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "License generation failed" }));
      throw new Error(error.error || "License generation failed");
    }

    return res.json();
  });

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployment, setDeployment] = useState<"cloud" | "self-hosted" | null>(null);

  const [form, setForm] = useState({
    email: "",
    company_name: "",
    role: "founder",
  });

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!deployment) return;
    setLoading(true);
    setError(null);

    try {
      // Sign up with defaults for fields we no longer ask
      await submitSignup({
        data: {
          ...form,
          company_type: "business",
          revenue_band: "under_100k",
        },
      });

      if (deployment === "self-hosted") {
        // Generate a free license key and go to download
        const license = await generateLicense({
          data: { email: form.email, company_name: form.company_name },
        });
        navigate({
          to: "/download",
          search: { license_key: license.license_key },
        });
      } else {
        // Cloud — go to provisioning placeholder
        navigate({ to: "/cloud" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition";
  const selectClass =
    "w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Get Started with Tell
                </h1>
                <p className="text-sm text-muted">
                  Create your account
                </p>
              </div>

              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    required
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className={inputClass}
                    placeholder="Acme Inc"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1.5">
                    Your Role
                  </label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className={selectClass}
                  >
                    <option value="founder">Founder / CEO</option>
                    <option value="engineering">Engineering</option>
                    <option value="data">Data / Analytics</option>
                    <option value="ops">Operations</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 mt-2 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition cursor-pointer"
                >
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Choose deployment
                </h1>
                <p className="text-sm text-muted">
                  Same product, same binary. You can switch later.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => setDeployment("self-hosted")}
                  className={`w-full text-left rounded-xl border p-5 transition cursor-pointer ${
                    deployment === "self-hosted"
                      ? "border-brand bg-brand/5"
                      : "border-border hover:border-zinc-600"
                  }`}
                >
                  <p className="text-[15px] font-medium text-white mb-1">Self-hosted</p>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">
                    Your servers, your data. Get a license key instantly.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeployment("cloud")}
                  className={`w-full text-left rounded-xl border p-5 transition cursor-pointer ${
                    deployment === "cloud"
                      ? "border-brand bg-brand/5"
                      : "border-border hover:border-zinc-600"
                  }`}
                >
                  <p className="text-[15px] font-medium text-white mb-1">Cloud</p>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">
                    We run the infrastructure. Start in 2 minutes.
                  </p>
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(null); }}
                  className="h-12 px-5 rounded-xl border border-border text-zinc-400 font-medium hover:text-white hover:border-zinc-600 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!deployment || loading}
                  className="flex-1 h-12 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Creating account..." : "Get Started"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

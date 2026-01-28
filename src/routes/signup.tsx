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

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    company_name: "",
    role: "founder",
    company_type: "business",
    revenue_band: "under_1m",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await submitSignup({ data: form });

      // Route based on next_step
      if (result.next_step === "free") {
        navigate({ to: "/download" });
      } else if (result.next_step?.monthly_price) {
        // Pro tier - redirect to Polar checkout
        const checkoutParams = new URLSearchParams({
          products: config.polar.proProductId,
          customerEmail: form.email,
          customerName: form.company_name,
          metadata: JSON.stringify({ customer_id: result.customer_id }),
        });
        window.location.href = `/api/checkout?${checkoutParams.toString()}`;
      } else {
        // Contact sales
        navigate({ to: "/thanks", search: { tier: "contact" } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition";
  const selectClass = "w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Get Started with Tell</h1>
            <p className="text-sm text-muted">Create your account to get a license key</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Company Name */}
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

            {/* Role */}
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

            {/* Company Type */}
            <div>
              <label htmlFor="company_type" className="block text-sm font-medium mb-1.5">
                Organization Type
              </label>
              <select
                id="company_type"
                value={form.company_type}
                onChange={(e) => setForm({ ...form, company_type: e.target.value })}
                className={selectClass}
              >
                <option value="business">Business</option>
                <option value="government">Government</option>
                <option value="education">Education</option>
                <option value="nonprofit">Non-profit</option>
              </select>
            </div>

            {/* Revenue Band */}
            <div>
              <label htmlFor="revenue" className="block text-sm font-medium mb-1.5">
                Annual Revenue
              </label>
              <select
                id="revenue"
                value={form.revenue_band}
                onChange={(e) => setForm({ ...form, revenue_band: e.target.value })}
                className={selectClass}
              >
                <option value="under_1m">Under $1M (Free)</option>
                <option value="1m_to_10m">$1M - $10M ($299/mo)</option>
                <option value="over_10m">Over $10M (Enterprise)</option>
              </select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Revenue-based pricing keeps Tell accessible to startups
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Get Started"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Free for companies under $1M revenue.{" "}
          <a href="https://github.com/tell-rs/tell/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted transition">
            View license
          </a>
        </p>
      </div>
    </main>
  );
}

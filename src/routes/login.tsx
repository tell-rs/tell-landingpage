import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { config } from "../config";

// Server function to send magic link
const sendMagicLink = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.PLATFORM_API_KEY;
    if (!apiKey) throw new Error("Server configuration error");

    const res = await fetch(`${config.apiUrl}/api/v1/auth/magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email: data.email }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Failed to send magic link" }));
      throw new Error(error.error || "Failed to send magic link");
    }

    return res.json();
  });

// Server function to verify code
const verifyCode = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; code: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.PLATFORM_API_KEY;
    if (!apiKey) throw new Error("Server configuration error");

    const res = await fetch(`${config.apiUrl}/api/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email: data.email, code: data.code }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Invalid code" }));
      throw new Error(error.error || "Invalid code");
    }

    return res.json();
  });

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendMagicLink({ data: { email } });
      setStep("code");
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

      // Store tokens in localStorage
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);

      // Redirect to account
      navigate({ to: "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition text-center text-lg tracking-widest";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {step === "email" ? "Sign in to Tell" : "Check your email"}
            </h1>
            <p className="text-sm text-muted">
              {step === "email"
                ? "Enter your email to receive a login code"
                : `We sent a code to ${email}`}
            </p>
          </div>

          {step === "email" ? (
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
                  className={inputClass.replace("text-center text-lg tracking-widest", "")}
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
                  className={inputClass}
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
                {loading ? "Verifying..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(null); }}
                className="w-full text-sm text-muted hover:text-foreground transition"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="underline hover:text-muted transition">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}

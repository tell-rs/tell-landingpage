import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/thanks")({
  component: ThanksPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tier: (search.tier as string) || "contact",
  }),
});

function ThanksPage() {
  const { tier } = Route.useSearch();

  const isPaid = tier === "pro" || tier === "starter";

  // Auto-redirect paid tiers to account page after 3 seconds
  useEffect(() => {
    if (isPaid) {
      const timer = setTimeout(() => {
        window.location.href = "/account?pending=true";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPaid]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand/10 flex items-center justify-center">
          {isPaid ? (
            <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {isPaid ? "Payment received!" : "We'll be in touch!"}
        </h1>

        <p className="text-muted mb-8 max-w-md mx-auto">
          {isPaid
            ? "Your license key will appear in your account momentarily. Redirecting..."
            : "Our team will reach out within 1 business day to discuss your needs and provide custom pricing."}
        </p>

        {/* Info Card */}
        <div className="bg-surface rounded-2xl p-6 text-left mb-8">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          {isPaid ? (
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">1</span>
                <span>Your license key will appear in your account</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">2</span>
                <span>Install Tell and activate your license</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">3</span>
                <span>Start collecting events and logs</span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">1</span>
                <span>Our team will reach out via email</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">2</span>
                <span>We'll discuss your requirements and use case</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">3</span>
                <span>Get custom pricing and onboarding support</span>
              </li>
            </ul>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isPaid ? (
            <Link
              to="/account"
              search={{ pending: true }}
              className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition"
            >
              Go to Account
            </Link>
          ) : (
            <a
              href="https://github.com/tell-rs/tell#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition"
            >
              View Documentation
            </a>
          )}
          <Link to="/" className="px-6 py-3 bg-surface text-foreground rounded-xl font-semibold hover:bg-surface/80 transition border border-border">
            Back to Home
          </Link>
        </div>

        {/* Contact */}
        <p className="mt-8 text-sm text-muted-foreground">
          Questions? Email us at{" "}
          <a href="mailto:hello@tell.rs" className="underline hover:text-muted transition">
            hello@tell.rs
          </a>
        </p>
      </div>
    </main>
  );
}

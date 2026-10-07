// Contact / sales route (spec 063 R-D1 H1).
//
// The tell-rs server authors the Enterprise upgrade URL as `{origin}/contact`
// (R-B1) — a non-checkout target that steers Enterprise away from a charged
// self-serve Pro checkout. /upgrade also routes any enterprise/unknown tier
// here. This page is a plain contact target; it never starts a checkout.

import { createFileRoute, Link } from "@tanstack/react-router";

const CONTACT_EMAIL = "hello@tell.rs";
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Tell — Enterprise / sales enquiry",
)}`;

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-lg text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-brand"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Talk to us</h1>

        <p className="text-muted mb-8 max-w-md mx-auto">
          Enterprise plans are tailored to your needs — dedicated infrastructure,
          SSO, audit logs, custom data residency, and an SLA. Tell us a little
          about your setup and our team will reach out within one business day.
        </p>

        <div className="bg-surface rounded-2xl p-6 text-left mb-8">
          <h3 className="font-semibold mb-4">What to expect</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">
                1
              </span>
              <span>Email us with your requirements and use case</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">
                2
              </span>
              <span>We'll discuss volume, deployment, and compliance needs</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">
                3
              </span>
              <span>Get custom pricing and onboarding support</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={MAILTO}
            className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition"
          >
            Email {CONTACT_EMAIL}
          </a>
          <Link
            to="/pricing"
            className="px-6 py-3 bg-surface text-foreground rounded-xl font-semibold hover:bg-surface/80 transition border border-border"
          >
            See pricing
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Looking for a self-serve plan?{" "}
          <Link to="/pricing" className="underline hover:text-muted transition">
            Compare Free and Pro
          </Link>
        </p>
      </div>
    </main>
  );
}

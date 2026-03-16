import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cloud")({
  component: CloudPage,
});

function CloudPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-lg text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Account created</h1>
        <p className="text-muted mb-8">
          We're setting up your cloud workspace. You'll receive an email
          at your address with login details shortly.
        </p>

        <div className="bg-surface rounded-2xl border border-border p-6 text-left mb-8">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Your workspace is being provisioned. This typically takes under a minute.
            Once ready, you can start sending events immediately using any of our 6 SDKs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition"
          >
            Back to Home
          </Link>
          <a
            href="mailto:hello@tell.rs"
            className="px-6 py-3 border border-border text-zinc-400 rounded-xl font-medium hover:text-white hover:border-zinc-600 transition"
          >
            Contact us
          </a>
        </div>
      </div>
    </main>
  );
}

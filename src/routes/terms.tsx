import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <Link
          to="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-[42px] md:text-[58px] font-semibold tracking-[-0.035em] text-white leading-[1.08] mt-8 mb-6">
          Terms of Service
        </h1>
        <p className="text-zinc-500 text-sm mb-16">
          Last updated: March 2026
        </p>

        {/* Content will go here */}
      </div>
    </div>
  );
}

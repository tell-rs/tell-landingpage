import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
});

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-zinc-500 hover:text-white transition p-2 hover:bg-zinc-800 rounded-lg flex-shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

function DownloadPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <div className="w-full max-w-lg text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">You're all set!</h1>
        <p className="text-muted mb-8">
          You're eligible for the free tier. No license key needed for companies under $1M revenue.
        </p>

        {/* Install Command */}
        <div className="bg-zinc-900 rounded-2xl px-4 sm:px-6 py-4 flex items-center justify-between gap-2 shadow-2xl shadow-zinc-900/20 mb-8">
          <code className="font-mono text-sm text-zinc-300 font-medium whitespace-nowrap">
            <span className="text-zinc-500 select-none">$ </span>
            curl -sSfL https://tell.rs | bash
          </code>
          <CopyButton text="curl -sSfL https://tell.rs | bash" />
        </div>

        {/* Next Steps */}
        <div className="bg-surface rounded-2xl p-6 text-left mb-8">
          <h3 className="font-semibold mb-4">Quick Start</h3>
          <ol className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">1</span>
              <span>Run the install command above</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">2</span>
              <span>Start Tell with <code className="bg-card border border-border px-1.5 py-0.5 rounded text-xs">tell serve</code></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">3</span>
              <span>Send your first event with <code className="bg-card border border-border px-1.5 py-0.5 rounded text-xs">tell test</code></span>
            </li>
          </ol>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

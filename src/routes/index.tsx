import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("curl -sSfL https://tell.rs | bash");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-zinc-500 hover:text-white transition-colors duration-200 p-2 hover:bg-white/5 rounded-lg flex-shrink-0"
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

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

const SDK_DATA = {
  go: {
    name: "Go",
    available: true,
    repo: "https://github.com/tell-rs/tell-go",
    example: `import "github.com/tell-rs/tell-go"

client := tell.New("your-api-key")
client.Track("signup_completed", tell.Props{
    "user_id": "usr_123",
    "plan":    "pro",
})`,
  },
  swift: {
    name: "Swift",
    available: true,
    repo: "https://github.com/tell-rs/tell-swift",
    example: `import Tell

let client = Tell(apiKey: "your-api-key")
client.track("signup_completed", properties: [
    "user_id": "usr_123",
    "plan": "pro"
])`,
  },
  cpp: {
    name: "C++",
    available: true,
    repo: "https://github.com/tell-rs/tell-cpp",
    example: `#include <tell/tell.h>

tell::Client client("your-api-key");
client.track("signup_completed", {
    {"user_id", "usr_123"},
    {"plan", "pro"}
});`,
  },
  flutter: {
    name: "Flutter",
    available: true,
    repo: "https://github.com/tell-rs/tell-flutter",
    example: `import 'package:tell/tell.dart';

final client = Tell(apiKey: 'your-api-key');
client.track('signup_completed', {
  'user_id': 'usr_123',
  'plan': 'pro',
});`,
  },
  typescript: {
    name: "TypeScript",
    available: false,
    repo: null,
    example: `import { Tell } from '@tell-rs/sdk';

const client = new Tell({ apiKey: 'your-api-key' });
client.track('signup_completed', {
  user_id: 'usr_123',
  plan: 'pro',
});`,
  },
  rust: {
    name: "Rust",
    available: false,
    repo: null,
    example: `use tell::Client;

let client = Client::new("your-api-key");
client.track("signup_completed", json!({
    "user_id": "usr_123",
    "plan": "pro"
})).await?;`,
  },
};

function SDKSection() {
  const [activeSDK, setActiveSDK] = useState<keyof typeof SDK_DATA>("go");
  const sdk = SDK_DATA[activeSDK];

  return (
    <section className="py-20 px-6 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Get started in 5 minutes</h2>
          <p className="text-zinc-400">Lightweight SDKs for every platform. One line to track events.</p>
        </div>

        {/* SDK tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.entries(SDK_DATA).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveSDK(key as keyof typeof SDK_DATA)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeSDK === key
                  ? "bg-brand text-white"
                  : data.available
                  ? "bg-zinc-900/50 border border-white/10 hover:border-white/20 text-white"
                  : "bg-zinc-900/30 border border-white/5 text-zinc-500"
              }`}
            >
              {data.name}
              {!data.available && <span className="ml-1 text-xs opacity-60">soon</span>}
            </button>
          ))}
        </div>

        {/* SDK code example */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-950 rounded-xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-zinc-900/50">
              <span className="text-xs text-zinc-500">{sdk.name}</span>
              {sdk.repo ? (
                <a
                  href={sdk.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  View repo
                </a>
              ) : (
                <span className="text-xs text-zinc-600">Coming soon</span>
              )}
            </div>
            <pre className="p-5 font-mono text-sm text-zinc-300 overflow-x-auto">
              <code>{sdk.example}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      {/* Hero */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-brand/15 rounded-full blur-[128px]" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[128px]" />
          <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-brand/8 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-sm text-zinc-400">Source available · Self-host forever</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Analytics that tell<br />the whole story
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Product analytics, logs, and business data — unified in one platform.
            Self-host in minutes. Your data stays yours.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors duration-200"
            >
              Get Started Free
              <ArrowIcon />
            </Link>
            <a
              href="https://github.com/tell-rs/tell"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200 border border-white/10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Install box */}
          <div className="mt-12 max-w-md mx-auto relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 via-transparent to-emerald-500/15 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-xl px-4 sm:px-5 py-3 flex items-center justify-between gap-2 border border-white/10">
              <code className="font-mono text-sm text-zinc-300 whitespace-nowrap">
                <span className="text-brand select-none">$ </span>
                curl -sSfL https://tell.rs | bash
              </code>
              <CopyButton />
            </div>
          </div>

          {/* Credibility */}
          <p className="mt-16 text-sm text-zinc-500">
            640x faster than PostHog · Built by the founder of Logpoint
          </p>
        </div>
      </main>

      {/* Three Pillars - The core value prop */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">One platform. Three data types. Full picture.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Most tools show you one slice. Tell correlates everything with shared session IDs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Events */}
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Product Analytics</h3>
              <p className="text-zinc-500 mb-4 text-sm leading-relaxed">What did users do?</p>
              <p className="text-zinc-400 text-sm leading-relaxed">Track events, build funnels, measure retention. Like Mixpanel — but unified with everything else.</p>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-zinc-600">Funnels · Retention · Cohorts · Breakdowns</p>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Logs & Errors</h3>
              <p className="text-zinc-500 mb-4 text-sm leading-relaxed">What did the system do?</p>
              <p className="text-zinc-400 text-sm leading-relaxed">Same SDK, same session ID. When a user reports a bug, see their journey AND the errors. No more "can't reproduce".</p>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-zinc-600">Structured logs · Syslog · Error tracking · Correlation</p>
              </div>
            </div>

            {/* Connectors */}
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">External Signals</h3>
              <p className="text-zinc-500 mb-4 text-sm leading-relaxed">What's happening around you?</p>
              <p className="text-zinc-400 text-sm leading-relaxed">Your analytics are blind outside your app. Connect GitHub, Shopify, ads — see stars spike with signups, orders correlate with campaigns.</p>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-zinc-600">GitHub · Shopify · Stripe · Ads platforms</p>
              </div>
            </div>
          </div>

          {/* The punchline */}
          <div className="mt-12 text-center">
            <p className="text-zinc-400">
              <span className="text-white font-medium">The result:</span> Checkout drop at step 3? See the correlated timeout errors. Revenue down? See which campaign, which flow, which error.
            </p>
          </div>
        </div>
      </section>

      {/* SDKs - moved up to show ease of use early */}
      <SDKSection />

      {/* What it replaces - the key insight for switchers */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">One platform, not three vendors</h2>
            <p className="text-zinc-400">Stop paying for tools that don't talk to each other.</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="mb-3 sm:mb-0">
                <p className="font-medium">Startups & SaaS</p>
                <p className="text-sm text-zinc-500">Events + logs + GitHub stars in one place</p>
              </div>
              <p className="text-sm text-zinc-600">Replaces: Mixpanel + Sentry + spreadsheets</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="mb-3 sm:mb-0">
                <p className="font-medium">E-commerce / DTC</p>
                <p className="text-sm text-zinc-500">Checkout funnels + orders + campaign KPIs</p>
              </div>
              <p className="text-sm text-zinc-600">Replaces: Triple Whale + Supermetrics</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="mb-3 sm:mb-0">
                <p className="font-medium">Enterprise</p>
                <p className="text-sm text-zinc-500">Self-hosted logs + dashboards + query</p>
              </div>
              <p className="text-sm text-zinc-600">Replaces: Elastic + Datadog + Splunk</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="mb-3 sm:mb-0">
                <p className="font-medium">OT / Industrial</p>
                <p className="text-sm text-zinc-500">Air-gapped, compliance-ready log collection</p>
              </div>
              <p className="text-sm text-zinc-600">Replaces: rsyslog + Splunk</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Pipeline</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Zero-copy Rust. Predictable latency.</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">Source-based routing with O(1) lookup. Fan-out to multiple sinks without copying data.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/5">
              <p className="text-sm font-medium text-brand uppercase tracking-wider mb-5">Sources</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">TCP (Binary)</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">HTTP (JSONL / Binary)</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Syslog (TCP / UDP)</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Connectors</span></li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/5">
              <p className="text-sm font-medium text-brand uppercase tracking-wider mb-5">Routing</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Source-based routing</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Fan-out to multiple sinks</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Filter and transform</span></li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/5">
              <p className="text-sm font-medium text-brand uppercase tracking-wider mb-5">Sinks</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">ClickHouse</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Arrow IPC</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Disk (binary / plaintext)</span></li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand rounded-full" /><span className="text-zinc-300">Parquet / Forwarder</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Connectors - simplified */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-brand uppercase tracking-wider mb-2">Connectors</p>
              <p className="text-zinc-400">Pull external data into your analytics. Scheduled syncs, automatic retry.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-zinc-900/50 rounded-lg text-sm font-medium border border-white/10">GitHub</span>
              <span className="px-4 py-2 bg-zinc-900/50 rounded-lg text-sm font-medium border border-white/10">Shopify</span>
              <span className="px-4 py-2 bg-zinc-900/30 rounded-lg text-sm font-medium border border-white/5 text-zinc-500">Stripe</span>
              <span className="px-4 py-2 bg-zinc-900/30 rounded-lg text-sm font-medium border border-white/5 text-zinc-500">Klaviyo</span>
              <span className="px-4 py-2 bg-zinc-900/30 rounded-lg text-sm font-medium border border-white/5 text-zinc-500">Meta Ads</span>
            </div>
          </div>
        </div>
      </section>

      {/* CLI - MOVED DOWN */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">CLI</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Tail and query from terminal</h3>
              <p className="text-zinc-400 mb-6">
                Live stream with filters. Query events with SQL. Works with jq, grep, and your existing tools.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Filter by workspace, source, type</span></li>
                <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Sampling and rate limiting</span></li>
                <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">SQL queries via ClickHouse or Polars</span></li>
              </ul>
            </div>
            <div className="bg-zinc-950 rounded-2xl p-6 font-mono text-sm space-y-4 border border-white/5">
              <div>
                <p className="text-zinc-600 mb-1"># Live tail with filters</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell tail --source tcp --type event</p>
              </div>
              <div>
                <p className="text-zinc-600 mb-1"># Query events</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell query "SELECT event_name, COUNT(*) FROM events GROUP BY 1"</p>
              </div>
              <div>
                <p className="text-zinc-600 mb-1"># Send test data</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell test</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Comparison</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How Tell compares</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 pr-4 font-medium text-zinc-400"></th>
                  <th className="text-center py-4 px-3 font-bold text-brand">Tell</th>
                  <th className="text-center py-4 px-3 font-medium text-zinc-500">PostHog</th>
                  <th className="text-center py-4 px-3 font-medium text-zinc-500">Mixpanel</th>
                  <th className="text-center py-4 px-3 font-medium text-zinc-500">Vector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Events &amp; funnels</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Logs</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">External data connectors</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">SDKs (track, identify)</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Dashboards</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Multi-source routing</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Multiple sinks</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">CLI (tail, query)</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Self-host (one binary)</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-500 text-xs">Docker</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Throughput</td>
                  <td className="py-3 px-3 text-center text-brand font-medium">64M/s</td>
                  <td className="py-3 px-3 text-center text-zinc-500">~100K/s</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-500">86 MiB/s</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-zinc-300">Source available</td>
                  <td className="py-3 px-3 text-center text-brand">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                  <td className="py-3 px-3 text-center text-zinc-600">—</td>
                  <td className="py-3 px-3 text-center text-zinc-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Full product for everyone</h2>
            <p className="text-zinc-400">Revenue-based pricing. All features included.</p>
          </div>

          <div className="bg-zinc-900/80 rounded-2xl border border-white/5 overflow-hidden">
            <div className="divide-y divide-white/5">
              <div className="flex justify-between items-center px-6 py-5">
                <div>
                  <p className="font-semibold">Individual</p>
                  <p className="text-sm text-zinc-500">Personal projects</p>
                </div>
                <p className="font-bold text-brand">Free</p>
              </div>
              <div className="flex justify-between items-center px-6 py-5">
                <div>
                  <p className="font-semibold">Startup</p>
                  <p className="text-sm text-zinc-500">Companies &lt; $1M revenue</p>
                </div>
                <p className="font-bold text-brand">Free</p>
              </div>
              <div className="flex justify-between items-center px-6 py-5 bg-brand/5 border-l-2 border-l-brand">
                <div>
                  <p className="font-semibold">Pro</p>
                  <p className="text-sm text-zinc-500">Companies $1M – $10M</p>
                </div>
                <p className="font-bold">$299<span className="text-zinc-500 font-normal">/mo</span></p>
              </div>
              <div className="flex justify-between items-center px-6 py-5">
                <div>
                  <p className="font-semibold">Enterprise</p>
                  <p className="text-sm text-zinc-500">Companies &gt; $10M · SLA + support</p>
                </div>
                <p className="font-bold">Custom</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <a href="https://github.com/tell-rs/tell/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-300 transition-colors duration-200">View full license</a>
            {" · "}Government, education, non-profit: contact us
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Subtle gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Ready to see the whole story?</h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Join the alpha. Free for startups. Get unified analytics in 5 minutes.
          </p>

          {/* Install box in CTA */}
          <div className="max-w-md mx-auto mb-8 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 via-transparent to-emerald-500/15 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-xl px-4 sm:px-5 py-3 flex items-center justify-between gap-2 border border-white/10">
              <code className="font-mono text-sm text-zinc-300 whitespace-nowrap">
                <span className="text-brand select-none">$ </span>
                curl -sSfL https://tell.rs | bash
              </code>
              <CopyButton />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors duration-200"
            >
              Get Started Free
              <ArrowIcon />
            </Link>
            <a
              href="https://github.com/tell-rs/tell"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200 border border-white/10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

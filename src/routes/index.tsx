import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("curl -sL tell.rs | sh");
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

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Home() {
  return (
    <>
      {/* Hero */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Analytics that tell<br />the whole story
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted max-w-lg mx-auto leading-relaxed">
            Events, logs, business data — one platform.
          </p>

          {/* Install box */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="bg-zinc-900 rounded-2xl px-4 sm:px-6 py-4 flex items-center justify-between gap-2 shadow-2xl shadow-zinc-900/20 overflow-x-auto">
              <code className="font-mono text-sm text-zinc-300 font-medium whitespace-nowrap">
                <span className="text-brand select-none">$ </span>
                curl -sL tell.rs | sh
              </code>
              <CopyButton />
            </div>
          </div>

          {/* Stats pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium text-muted">64M events/sec</span>
            <span className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium text-muted">One binary</span>
            <span className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium text-muted">Self-host forever</span>
          </div>

          {/* Credibility */}
          <p className="mt-16 text-sm text-muted-foreground">
            640x faster ingestion than PostHog
          </p>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </main>

      {/* Pipeline */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">Pipeline</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Zero-copy Rust. Predictable latency.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Sources */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">Sources</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">TCP (Binary)</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">HTTP (JSONL / Binary)</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Syslog (TCP / UDP)</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Connectors</span></li>
              </ul>
            </div>

            {/* Routing */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">Routing</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Source-based routing</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Fan-out to multiple sinks</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Filter and transform</span></li>
              </ul>
            </div>

            {/* Sinks */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">Sinks</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">ClickHouse</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Arrow</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Disk (binary / plaintext)</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Parquet</span></li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-brand rounded-full" /><span className="font-medium">Forwarder</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CLI */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">CLI</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Tail and query from terminal</h3>
              <p className="text-muted mb-6">
                Live stream with filters. Query events with SQL. Works with jq, grep, and your existing tools.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckIcon />Filter by workspace, source, type</li>
                <li className="flex items-center gap-2"><CheckIcon />Sampling and rate limiting</li>
                <li className="flex items-center gap-2"><CheckIcon />SQL queries via ClickHouse or Polars</li>
              </ul>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div>
                <p className="text-zinc-500 mb-1"># Live tail with filters</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell tail --source tcp --type event</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1"># Query events</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell query "SELECT event_name, COUNT(*) FROM events GROUP BY 1"</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1"># Send test data</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell test</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connectors */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">Connectors</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Business data, not just events</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Pull from GitHub, Shopify, and more. Correlate product events with stars, orders, revenue.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200">
              <p className="font-semibold mb-1">GitHub</p>
              <p className="text-sm text-muted">Stars, forks, issues, PRs</p>
            </div>
            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200">
              <p className="font-semibold mb-1">Shopify</p>
              <p className="text-sm text-muted">Orders, revenue, customers</p>
            </div>
            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200/50">
              <p className="font-semibold text-muted-foreground mb-1">Stripe</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200/50">
              <p className="font-semibold text-muted-foreground mb-1">Google Analytics</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">Solutions</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Built for teams that need the full picture</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-zinc-200">
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-3">Startups</p>
              <h3 className="text-xl font-bold mb-3">Product analytics + logs + business signals</h3>
              <p className="text-muted mb-4">One SDK for events and logs. Connectors for GitHub and Shopify. Funnels, retention, and correlated debugging in one place.</p>
              <p className="text-sm text-muted-foreground">Replaces: Mixpanel + Sentry + spreadsheets</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-zinc-200">
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-3">DTC / Ecommerce</p>
              <h3 className="text-xl font-bold mb-3">360 view across checkout, orders, and campaigns</h3>
              <p className="text-muted mb-4">Unify checkout funnels with orders, refunds, and campaign KPIs. Answer "what changed?" with driver analysis.</p>
              <p className="text-sm text-muted-foreground">Replaces: Triple Whale + Supermetrics + spreadsheets</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-zinc-200">
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-3">Enterprise</p>
              <h3 className="text-xl font-bold mb-3">Self-hosted logs and observability</h3>
              <p className="text-muted mb-4">Fast pipeline with dashboards and query. Replace heavy ELK-style ops. Unify data across teams with no vendor lock-in.</p>
              <p className="text-sm text-muted-foreground">Replaces: Elastic + Datadog + Splunk</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-zinc-200">
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-3">OT / Industrial</p>
              <h3 className="text-xl font-bold mb-3">Air-gapped, compliance-ready log collection</h3>
              <p className="text-muted mb-4">One Rust binary, deterministic performance, runs fully off-grid. High-throughput binary collector with syslog support for legacy devices.</p>
              <p className="text-sm text-muted-foreground">Replaces: rsyslog + Splunk</p>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16 px-6 bg-white border-y border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-semibold mb-1">SDKs</p>
              <p className="text-sm text-muted">Send events and logs from your app</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-zinc-50 rounded-lg text-sm font-medium border border-zinc-200">Go</span>
              <span className="px-4 py-2 bg-zinc-50 rounded-lg text-sm font-medium border border-zinc-200">Swift</span>
              <span className="px-4 py-2 bg-zinc-50 rounded-lg text-sm font-medium border border-zinc-200">C++</span>
              <span className="px-4 py-2 bg-zinc-50 rounded-lg text-sm font-medium border border-zinc-200/50 text-muted-foreground">Flutter</span>
              <span className="px-4 py-2 bg-zinc-50 rounded-lg text-sm font-medium border border-zinc-200/50 text-muted-foreground">Rust</span>
              <span className="px-4 py-2 bg-zinc-50 rounded-lg text-sm font-medium border border-zinc-200/50 text-muted-foreground">TypeScript</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Full product for everyone</h2>
            <p className="text-muted">No feature gating. Revenue-based pricing for companies.</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="divide-y divide-zinc-100">
              <div className="flex justify-between items-center px-6 py-4">
                <div>
                  <p className="font-semibold">Individual</p>
                  <p className="text-sm text-muted">Personal projects</p>
                </div>
                <p className="font-bold text-brand">Free</p>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <div>
                  <p className="font-semibold">Company &lt; $1M revenue</p>
                  <p className="text-sm text-muted">Key required</p>
                </div>
                <p className="font-bold text-brand">Free</p>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <div>
                  <p className="font-semibold">Company $1M - $10M</p>
                  <p className="text-sm text-muted">Pro tier</p>
                </div>
                <p className="font-bold">$299<span className="text-muted-foreground font-normal">/mo</span></p>
              </div>
              <div className="flex justify-between items-center px-6 py-4">
                <div>
                  <p className="font-semibold">Company &gt; $10M</p>
                  <p className="text-sm text-muted">Enterprise tier</p>
                </div>
                <p className="font-bold">$2,000<span className="text-muted-foreground font-normal">+/mo</span></p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <a href="https://github.com/tell-rs/tell/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted transition">View full license</a>
            {" · "}Government, education, non-profit: contact us
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Ready to see the whole story?</h2>
          <p className="text-muted mb-10 max-w-xl mx-auto">
            Tell is in alpha. We're working with early teams to shape the product. If you're interested in unified analytics, let's talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition">
              Get Started
            </Link>
            <a href="https://github.com/tell-rs/tell" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-zinc-100 text-zinc-900 rounded-xl font-semibold hover:bg-zinc-200 transition">
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

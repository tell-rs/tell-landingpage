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

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

const SDK_DATA = {
  swift: {
    name: "Swift",
    available: true,
    repo: "https://github.com/tell-rs/tell-swift",
    example: `import Tell

let client = Tell(apiKey: "your-api-key")

client.track("purchase_completed", properties: [
    "revenue": 149.99,
    "product": "Pro Plan"
])`,
  },
  flutter: {
    name: "Flutter",
    available: true,
    repo: "https://github.com/tell-rs/tell-flutter",
    example: `import 'package:tell/tell.dart';

final client = Tell(apiKey: 'your-api-key');

client.track('purchase_completed', {
  'revenue': 149.99,
  'product': 'Pro Plan',
});`,
  },
  go: {
    name: "Go",
    available: true,
    repo: "https://github.com/tell-rs/tell-go",
    example: `import "github.com/tell-rs/tell-go"

client := tell.New("your-api-key")

client.Track("purchase_completed", tell.Props{
    "revenue": 149.99,
    "product": "Pro Plan",
})`,
  },
  typescript: {
    name: "TypeScript",
    available: false,
    repo: null,
    example: `import { Tell } from '@tell-rs/sdk';

const client = new Tell({ apiKey: 'your-api-key' });

client.track('purchase_completed', {
  revenue: 149.99,
  product: 'Pro Plan',
});`,
  },
  rust: {
    name: "Rust",
    available: false,
    repo: null,
    example: `use tell::Client;

let client = Client::new("your-api-key");

client.track("purchase_completed", json!({
    "revenue": 149.99,
    "product": "Pro Plan"
})).await?;`,
  },
};

function SDKSection() {
  const [activeSDK, setActiveSDK] = useState<keyof typeof SDK_DATA>("swift");
  const sdk = SDK_DATA[activeSDK];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Integration</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Add tracking in minutes</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Lightweight SDKs for mobile and server. A few lines of code to start tracking.</p>
        </div>

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

        <div className="max-w-xl mx-auto">
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
                  View SDK
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
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-brand/15 rounded-full blur-[128px]" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[128px]" />
          <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-brand/8 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-sm text-zinc-400">Now in alpha · Free for startups</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Analytics that tell<br />the whole story
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Product analytics, logs, and business signals — unified in one platform.
            Track user behavior. Understand what changed. Ship with confidence.
          </p>

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

          <p className="mt-16 text-sm text-zinc-500">
            64M events/sec · Self-host in 5 minutes · Built by the founder of Logpoint
          </p>
        </div>
      </main>

      {/* Platform - Three Pillars */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">The Platform</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to understand your business</h2>
          </div>

          {/* Product Analytics */}
          <div className="mb-12">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 pl-1">Product Analytics</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">Funnels</h3>
                <p className="text-xs text-zinc-500">See where users drop off</p>
              </div>

              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">Retention</h3>
                <p className="text-xs text-zinc-500">Daily, weekly, monthly</p>
              </div>

              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">Cohorts</h3>
                <p className="text-xs text-zinc-500">Group by behavior</p>
              </div>

              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">User Journeys</h3>
                <p className="text-xs text-zinc-500">Trace paths & patterns</p>
              </div>
            </div>
          </div>

          {/* Logs & Events */}
          <div className="mb-12">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 pl-1">Logs & Events</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">Application Logs</h3>
                <p className="text-xs text-zinc-500">Structured app events</p>
              </div>

              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">Errors</h3>
                <p className="text-xs text-zinc-500">Exceptions & crashes</p>
              </div>

              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">System Events</h3>
                <p className="text-xs text-zinc-500">Infrastructure signals</p>
              </div>

              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">Audit Trails</h3>
                <p className="text-xs text-zinc-500">Who did what, when</p>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 pl-1">Integrations</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.337 23.979l2.146-6.203h5.016L8.665 0l-2.148 6.203H1.5l13.837 17.776z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">Shopify</h3>
                <p className="text-xs text-zinc-500">Orders & customers</p>
              </div>

              <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">GitHub</h3>
                <p className="text-xs text-zinc-500">Deploys & commits</p>
              </div>

              <div className="p-5 bg-zinc-900/30 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/5 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1 text-zinc-500">Stripe</h3>
                <p className="text-xs text-zinc-600">Coming soon</p>
              </div>

              <div className="p-5 bg-zinc-900/30 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/5 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm4.5 13.5h-9v-1.5c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25v1.5z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1 text-zinc-500">Klaviyo</h3>
                <p className="text-xs text-zinc-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Why - the differentiator */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">The Difference</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">When metrics drop, know exactly why</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Most analytics tools show you what happened. Tell shows you why — with correlated logs and external signals in the same view.</p>
          </div>

          <div className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left: The insight */}
              <div className="p-8 md:border-r border-white/5">
                <p className="text-sm text-zinc-500 mb-6">Example: Checkout conversion dropped</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Funnel shows 23% drop at payment</p>
                      <p className="text-sm text-zinc-500">Product analytics</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Stripe timeout errors spiking</p>
                      <p className="text-sm text-zinc-500">Correlated logs</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Deploy changed Stripe config</p>
                      <p className="text-sm text-zinc-500">External signal (GitHub)</p>
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-sm text-zinc-400">
                  One dashboard. Full context. No tab switching.
                </p>
              </div>

              {/* Right: Visual */}
              <div className="p-8 bg-zinc-900/30">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-zinc-400">Checkout Funnel</p>
                  <span className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400">-23%</span>
                </div>

                <div className="h-32 bg-zinc-900/50 rounded-lg flex items-end justify-around px-4 pb-3 mb-6">
                  <div className="text-center">
                    <div className="w-10 bg-zinc-600 rounded-t mb-2" style={{ height: '85px' }} />
                    <p className="text-xs text-zinc-500">Cart</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 bg-zinc-600 rounded-t mb-2" style={{ height: '70px' }} />
                    <p className="text-xs text-zinc-500">Info</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 bg-red-500/60 rounded-t mb-2" style={{ height: '40px' }} />
                    <p className="text-xs text-red-400">Payment</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 bg-zinc-700 rounded-t mb-2" style={{ height: '35px' }} />
                    <p className="text-xs text-zinc-500">Done</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 mb-3">Correlated events</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-zinc-400">14:32</span>
                    <span className="text-zinc-300">stripe_timeout</span>
                    <span className="text-zinc-600 ml-auto">×47</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-zinc-400">11:15</span>
                    <span className="text-zinc-300">deploy: stripe-sdk</span>
                    <span className="text-zinc-600 ml-auto">main</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Teams */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">For Teams</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for how teams actually work</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-brand mb-2">Product</p>
              <h3 className="font-semibold mb-2">Measure what matters</h3>
              <p className="text-sm text-zinc-500">Track feature adoption, find drop-off points, understand segments. Make decisions with data.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-sm font-medium text-brand mb-2">Growth</p>
              <h3 className="font-semibold mb-2">Optimize the funnel</h3>
              <p className="text-sm text-zinc-500">Acquisition to activation to revenue. See which channels convert, where users churn.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-brand mb-2">Engineering</p>
              <h3 className="font-semibold mb-2">Debug in context</h3>
              <p className="text-sm text-zinc-500">When something breaks, see the user journey alongside errors. One SDK, correlated by session.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SDK Section */}
      <SDKSection />


      {/* CLI */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">CLI</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Query from your terminal</h3>
              <p className="text-zinc-400 mb-6">
                Live tail events. Run SQL queries. Pipe to jq or your existing tools.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Real-time event streaming</span></li>
                <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">SQL queries via ClickHouse</span></li>
                <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Filter by workspace, source, type</span></li>
              </ul>
            </div>
            <div className="bg-zinc-950 rounded-2xl p-6 font-mono text-sm space-y-4 border border-white/5">
              <div>
                <p className="text-zinc-600 mb-1"># Live tail</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell tail --type event</p>
              </div>
              <div>
                <p className="text-zinc-600 mb-1"># Query</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> tell query "SELECT event, COUNT(*) GROUP BY 1"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Simple, revenue-based pricing</h2>
            <p className="text-zinc-400">All features included. No per-seat fees. Pay based on your company's ARR.</p>
          </div>

          <div className="bg-zinc-900/80 rounded-2xl border border-white/5 overflow-hidden">
            <div className="divide-y divide-white/5">
              <div className="flex justify-between items-center px-6 py-5">
                <div>
                  <p className="font-semibold">Free</p>
                  <p className="text-sm text-zinc-500">Companies &lt; $100K ARR</p>
                </div>
                <p className="font-bold text-brand">$0</p>
              </div>
              <div className="flex justify-between items-center px-6 py-5">
                <div>
                  <p className="font-semibold">Starter</p>
                  <p className="text-sm text-zinc-500">$100K – $1M ARR</p>
                </div>
                <p className="font-bold">$9<span className="text-zinc-500 font-normal">/mo</span></p>
              </div>
              <div className="flex justify-between items-center px-6 py-5 bg-brand/5 border-l-2 border-l-brand">
                <div>
                  <p className="font-semibold">Pro</p>
                  <p className="text-sm text-zinc-500">$1M – $10M ARR</p>
                </div>
                <p className="font-bold">$299<span className="text-zinc-500 font-normal">/mo</span></p>
              </div>
              <div className="flex justify-between items-center px-6 py-5">
                <div>
                  <p className="font-semibold">Enterprise</p>
                  <p className="text-sm text-zinc-500">&gt; $10M ARR, custom terms</p>
                </div>
                <p className="font-bold">Custom</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Self-host anywhere · Source available · <a href="https://github.com/tell-rs/tell/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-300 transition-colors duration-200">View license</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Ready to see the whole story?</h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Join the alpha. Free for startups. Self-host in 5 minutes.
          </p>

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

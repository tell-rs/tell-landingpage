import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ot")({
  component: OTPage,
  head: () => ({
    meta: [
      { title: "Tell for OT - Secure Log Collection for Critical Infrastructure" },
      { name: "description", content: "Air-gapped log collection built in Rust. Single binary, no cloud dependency, no GC pauses. CRA, NIS2, IEC 62443 ready." },
      // Open Graph
      { property: "og:title", content: "Tell for OT - Secure Log Collection for Critical Infrastructure" },
      { property: "og:description", content: "Air-gapped log collection built in Rust. Single binary, no cloud dependency, no GC pauses. CRA, NIS2, IEC 62443 ready." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tell.rs/ot" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tell for OT - Secure Log Collection for Critical Infrastructure" },
      { name: "twitter:description", content: "Air-gapped log collection built in Rust. Single binary, no cloud dependency, no GC pauses." },
    ],
  }),
});

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CheckIcon({ className = "text-brand" }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function OTPage() {
  return (
    <>
      {/* Hero */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-brand/8 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
            <ShieldIcon />
            <span className="text-sm text-emerald-400">For Critical Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Secure log collection<br />for air-gapped environments
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Single binary. No cloud dependency. No GC pauses. Built in Rust for OT networks where security and determinism are non-negotiable.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ot@tell.rs?subject=Tell%20for%20OT%20-%20Demo%20Request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors duration-200"
            >
              Request Demo
              <ArrowIcon />
            </a>
            <a
              href="https://github.com/tell-rs/tell"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200 border border-white/10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View Source
            </a>
          </div>

          <p className="mt-16 text-sm text-zinc-500">
            65M events/sec · &lt;1ms P99 · &lt;15MB binary · Built by the founder of Logpoint
          </p>
        </div>
      </main>

      {/* The Problem */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Existing solutions don't fit OT</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-red-500/10">
              <p className="font-semibold text-red-400 mb-3">Elastic / ELK</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Java-based, requires JVM</li>
                <li>Garbage collection pauses</li>
                <li>Large attack surface</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-red-500/10">
              <p className="font-semibold text-red-400 mb-3">Splunk</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Requires proprietary hardware (Edge Hub)</li>
                <li>Complex multi-component architecture</li>
                <li>Enterprise pricing</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-red-500/10">
              <p className="font-semibold text-red-400 mb-3">Vector</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Pipeline only</li>
                <li>No analytics or dashboards</li>
                <li>No compliance reporting</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-red-500/10">
              <p className="font-semibold text-red-400 mb-3">Custom Scripts</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Unmaintainable</li>
                <li>No auditability</li>
                <li>Fails compliance review</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rust */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Why Rust</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Safety-critical by design</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Memory safety and thread safety verified at compile time — not runtime. No garbage collector means deterministic, predictable performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Memory Safe</h3>
              <p className="text-sm text-zinc-500">Buffer overflows, use-after-free, data races — eliminated by the compiler, not by testing.</p>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">No GC Pauses</h3>
              <p className="text-sm text-zinc-500">Memory freed immediately when no longer needed. Predictable latency in real-time environments.</p>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Auditable</h3>
              <p className="text-sm text-zinc-500">Entire vulnerability classes proven absent by design. Demonstrate to auditors, not just claim.</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-zinc-950 rounded-xl border border-white/5">
            <p className="text-sm text-zinc-400 italic">
              "Roughly 90% of what we used to check with external tools is built into Rust's compiler."
            </p>
            <p className="text-xs text-zinc-600 mt-2">— Rust Safety-Critical Consortium, 2026</p>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for constrained environments</h2>
          </div>

          <div className="space-y-8">
            {/* Single Binary */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-3">Single Binary, Minimal Surface</h3>
                <p className="text-zinc-400 mb-4">
                  All functionality compiled into one executable. No runtime dependencies. No dynamic linking. Dependency count in dozens, not hundreds.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Static linking — copy to deploy</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Automated SBOM generation</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Each dependency audited and justified</span></li>
                </ul>
              </div>
              <div className="bg-zinc-950 rounded-xl p-6 font-mono text-sm border border-white/5">
                <p className="text-zinc-500 mb-2"># Deploy</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> scp tell-collector edge-node:/usr/local/bin/</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> ssh edge-node "tell-collector -config /etc/tell/config.yaml"</p>
                <p className="text-zinc-500 mt-4"># Binary size</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> ls -lh tell-collector</p>
                <p className="text-zinc-400">-rwxr-xr-x 1 root root <span className="text-emerald-400">12M</span> tell-collector</p>
              </div>
            </div>

            {/* Air-Gapped */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-zinc-950 rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-zinc-400">Offline Mode Active</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Local buffer</span>
                    <span className="text-zinc-300">847 MB / 2 GB</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42%' }} />
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Queued for sync</span>
                    <span className="text-zinc-300">12,847 events</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Last upstream sync</span>
                    <span className="text-zinc-300">3 days ago</span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-xl font-semibold mb-3">Air-Gapped Operation</h3>
                <p className="text-zinc-400 mb-4">
                  Operates fully offline. No cloud dependency. No license server. Logs stored locally, forwarded when connectivity allows.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Store-and-forward when upstream available</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Cryptographic offline license</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">No compliance gap during disconnection</span></li>
                </ul>
              </div>
            </div>

            {/* Workspace Isolation */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-3">Workspace Isolation</h3>
                <p className="text-zinc-400 mb-4">
                  Multi-tenant by design. Each workspace has its own API key. Events are isolated at ingestion. No data mixing between workspaces.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Per-workspace API keys (O(1) validation)</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Hot-reload key rotation without restart</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Secure forwarding mode (never trust source_ip by default)</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Per-workspace metrics isolation</span></li>
                </ul>
              </div>
              <div className="bg-zinc-950 rounded-xl p-6 font-mono text-xs border border-white/5">
                <p className="text-zinc-500 mb-2"># apikeys.conf - hot reloaded</p>
                <p className="text-zinc-300"><span className="text-zinc-500"># format: hex_key:workspace_id</span></p>
                <p className="text-zinc-300 mt-2"><span className="text-emerald-400">000102030405060708090a0b0c0d0e0f</span>:<span className="text-brand">1</span></p>
                <p className="text-zinc-300"><span className="text-emerald-400">deadbeefdeadbeefdeadbeefdeadbeef</span>:<span className="text-brand">2</span></p>
                <p className="text-zinc-300"><span className="text-emerald-400">f1e2d3c4b5a6978867452312fdecba98</span>:<span className="text-brand">3</span></p>
                <p className="text-zinc-500 mt-4"># 32 hex chars = 16 bytes per key</p>
                <p className="text-zinc-500"># Changes detected automatically</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OT Configuration */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Configuration</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">OT profile built-in</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Pre-configured for security-first environments. Minimal footprint, localhost-only binding, no customer identification in logs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-950 rounded-xl p-6 font-mono text-xs border border-white/5 overflow-x-auto">
              <p className="text-zinc-500 mb-4"># config.yaml - OT profile</p>
              <p className="text-zinc-400">global:</p>
              <p className="text-zinc-300 pl-4">num_processors: <span className="text-brand">4</span></p>
              <p className="text-zinc-300 pl-4">buffer_size: <span className="text-brand">65536</span>  <span className="text-zinc-600"># 64KB</span></p>
              <p className="text-zinc-300 pl-4">batch_size: <span className="text-brand">100</span></p>
              <p className="text-zinc-300 pl-4">api_keys_file: <span className="text-emerald-400">"apikeys.conf"</span></p>
              <p className="text-zinc-400 mt-3">metrics:</p>
              <p className="text-zinc-300 pl-4">profile: <span className="text-emerald-400">"ot"</span></p>
              <p className="text-zinc-300 pl-4">interval: <span className="text-brand">60s</span>  <span className="text-zinc-600"># minimal</span></p>
              <p className="text-zinc-300 pl-4">format: <span className="text-emerald-400">"compact"</span></p>
              <p className="text-zinc-400 mt-3">sources:</p>
              <p className="text-zinc-300 pl-4">tcp:</p>
              <p className="text-zinc-300 pl-6">- address: <span className="text-emerald-400">"127.0.0.1"</span>  <span className="text-zinc-600"># localhost only</span></p>
              <p className="text-zinc-300 pl-8">port: <span className="text-brand">50000</span></p>
              <p className="text-zinc-300 pl-8">forwarding_mode: <span className="text-red-400">false</span></p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">OT Profile Defaults</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">4 processors (low resource usage)</span></li>
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">64KB buffers (minimal memory)</span></li>
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">60s metric intervals (reduced overhead)</span></li>
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Localhost binding (no external exposure)</span></li>
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Compact format (no PII in logs)</span></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Storage Options</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>disk_plaintext — Human-readable, daily/hourly rotation</li>
                  <li>disk_binary — LZ4 compressed, high throughput</li>
                  <li>parquet — Columnar, Snappy/LZ4/Gzip compression</li>
                  <li>clickhouse — When upstream connectivity allows</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Compliance</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Built for regulatory requirements</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Designed from the ground up to meet CRA, NIS2, and IEC 62443 requirements for critical infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">EU Cyber Resilience Act</p>
              <h3 className="font-semibold mb-4">CRA Ready</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Security by design — Rust memory safety</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Supply chain transparency — automated SBOM</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Minimal attack surface — single binary</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">Network & Information Security</p>
              <h3 className="font-semibold mb-4">NIS2 Compliant</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Log retention — configurable rotation policies</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Incident detection — real-time metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Access control — per-workspace API keys</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">Industrial Security</p>
              <h3 className="font-semibold mb-4">IEC 62443</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Zone-ready — localhost binding, workspace isolation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Secure development — Rust memory safety</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Deterministic operation — safe for OT segments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Performance */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Performance</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Guaranteed envelope</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">65M</p>
              <p className="text-sm text-zinc-500">events/sec sustained</p>
            </div>
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">&lt;1ms</p>
              <p className="text-sm text-zinc-500">P99 latency</p>
            </div>
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">&lt;15MB</p>
              <p className="text-sm text-zinc-500">binary size</p>
            </div>
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">&lt;100ms</p>
              <p className="text-sm text-zinc-500">startup time</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-zinc-950 rounded-xl border border-white/5">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-zinc-500 mb-2">Resource guarantees</p>
                <ul className="space-y-1 text-zinc-400">
                  <li>Memory: bounded, configurable ceiling</li>
                  <li>CPU: predictable, no GC spikes</li>
                  <li>Network: backpressure handling</li>
                </ul>
              </div>
              <div>
                <p className="text-zinc-500 mb-2">Safe for deployment on</p>
                <ul className="space-y-1 text-zinc-400">
                  <li>OT network segments</li>
                  <li>Edge nodes with limited resources</li>
                  <li>Safety-critical control systems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-zinc-900/30 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand/5 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Ready to secure your infrastructure?</h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Talk to our team about deployment in your OT environment. Source-available for evaluation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ot@tell.rs?subject=Tell%20for%20OT%20-%20Demo%20Request"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors duration-200"
            >
              Request Demo
              <ArrowIcon />
            </a>
            <a
              href="https://github.com/tell-rs/tell"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200 border border-white/10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View Source
            </a>
          </div>

          <p className="mt-10 text-sm text-zinc-500">
            Source-available · Self-host anywhere · No cloud dependency
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-zinc-400 hover:text-white text-sm transition-colors">
              tell.rs
            </Link>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500 text-sm">OT / Industrial</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="mailto:ot@tell.rs" className="hover:text-white transition-colors">
              ot@tell.rs
            </a>
            <a href="https://github.com/tell-rs/tell" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

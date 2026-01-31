import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ot")({
  component: OTPage,
  head: () => ({
    meta: [
      { title: "Tell for OT - Secure Log Collection for Critical Infrastructure" },
      { name: "description", content: "Air-gapped log collection built in Rust. Single binary, no cloud dependency, no GC pauses. Designed for CRA, NIS2, IEC 62443." },
      // Open Graph
      { property: "og:title", content: "Tell for OT - Secure Log Collection for Critical Infrastructure" },
      { property: "og:description", content: "Air-gapped log collection built in Rust. Single binary, no cloud dependency, no GC pauses. Designed for CRA, NIS2, IEC 62443." },
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
            64M events/sec · Sub-millisecond latency · Single binary · Built by the founder of Logpoint
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
                <li>Garbage collection pauses cause log loss</li>
                <li>Large attack surface</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-red-500/10">
              <p className="font-semibold text-red-400 mb-3">Splunk</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Complex multi-component architecture</li>
                <li>Container runtime dependencies</li>
                <li>Enterprise pricing, cloud dependency</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-red-500/10">
              <p className="font-semibold text-red-400 mb-3">Vector</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Pipeline only — no analytics or query</li>
                <li>No workspace isolation</li>
                <li>No compliance reporting</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-red-500/10">
              <p className="font-semibold text-red-400 mb-3">Custom Scripts</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Unmaintainable at scale</li>
                <li>No auditability or SBOM</li>
                <li>Fails compliance review</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Secure by Design */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Secure by Design</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Vulnerability classes eliminated by the compiler
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Written in Rust — the language recommended by CISA, NSA, and the EU Cyber Resilience Act for critical infrastructure. Memory safety and thread safety verified at compile time, not runtime.
            </p>
          </div>

          {/* Industry stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-red-400 mb-2">70%</p>
              <p className="text-sm text-zinc-500">of Microsoft CVEs are memory safety bugs</p>
              <p className="text-xs text-zinc-600 mt-1">Microsoft MSRC, 2019</p>
            </div>
            <div className="text-center p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-red-400 mb-2">67%</p>
              <p className="text-sm text-zinc-500">of Chrome critical vulns are memory safety</p>
              <p className="text-xs text-zinc-600 mt-1">Google Project Zero</p>
            </div>
            <div className="text-center p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-emerald-400 mb-2">76% → 24%</p>
              <p className="text-sm text-zinc-500">Android memory bugs after Rust adoption</p>
              <p className="text-xs text-zinc-600 mt-1">Google, 2024</p>
            </div>
          </div>

          {/* Threat elimination grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              "Buffer overflow",
              "Use-after-free",
              "Double-free",
              "Data races",
              "Null pointer dereference",
              "Uninitialized memory",
            ].map((threat) => (
              <div key={threat} className="flex items-center gap-3 p-4 bg-zinc-950 rounded-xl border border-emerald-500/10">
                <CheckIcon className="text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-zinc-300">{threat}</p>
                  <p className="text-xs text-emerald-500/70">Eliminated at compile time</p>
                </div>
              </div>
            ))}
          </div>

          {/* Compiler properties */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Memory Safe</h3>
              <p className="text-sm text-zinc-500">Every buffer access is bounds-checked. Every allocation has exactly one owner. The compiler rejects code containing these bugs before it can run.</p>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Thread Safe</h3>
              <p className="text-sm text-zinc-500">The type system tracks shared data between threads. Under peak load — thousands of devices sending simultaneously — logs are not corrupted, lost, or reordered.</p>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">No Runtime</h3>
              <p className="text-sm text-zinc-500">No JVM, no garbage collector, no interpreter. 84ns per event, deterministic. No "stop the world" moments where logs are lost during traffic spikes.</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-zinc-950 rounded-xl border border-white/5">
            <p className="text-sm text-zinc-400 italic">
              "Roughly 90% of what we used to check with external tools is built into Rust's compiler."
            </p>
            <p className="text-xs text-zinc-600 mt-2">— Principal Firmware Engineer, mobile robotics (Rust Blog, Jan 2026)</p>
          </div>

          {/* Authority references */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-zinc-600">
            <span>CISA / NSA Joint Advisory (2023)</span>
            <span className="text-zinc-800">·</span>
            <span>EU Cyber Resilience Act</span>
            <span className="text-zinc-800">·</span>
            <span>NIST Secure Software Development Framework</span>
            <span className="text-zinc-800">·</span>
            <span>Rust in Linux Kernel (6.1+)</span>
          </div>
        </div>
      </section>

      {/* Full-Path Integrity */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Full-Path Integrity</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Compiler-verified from instrumentation to storage
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              When using the Rust SDK, safety guarantees extend across the entire data path. Every buffer, every thread, every network write — verified at compile time. No other log collection system offers this.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-emerald-500/10 text-center">
              <p className="text-2xl font-bold text-emerald-400 mb-2">80ns</p>
              <p className="text-sm font-semibold text-zinc-300 mb-1">SDK Call</p>
              <p className="text-xs text-zinc-500">Serialize, encode, enqueue. The calling thread never touches the network.</p>
            </div>
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-emerald-500/10 text-center">
              <p className="text-2xl font-bold text-emerald-400 mb-2">Zero-copy</p>
              <p className="text-sm font-semibold text-zinc-300 mb-1">Collector Pipeline</p>
              <p className="text-xs text-zinc-500">O(1) routing, fan-out via reference count. No data duplication.</p>
            </div>
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-emerald-500/10 text-center">
              <p className="text-2xl font-bold text-emerald-400 mb-2">Atomic</p>
              <p className="text-sm font-semibold text-zinc-300 mb-1">Storage / Forward</p>
              <p className="text-xs text-zinc-500">Atomic disk writes with rotation. Retry and keepalive on forwarding.</p>
            </div>
          </div>

          <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
            <p className="text-sm text-zinc-400 mb-4">
              <span className="text-emerald-400 font-medium">Retention path:</span> Application with Rust SDK serializes each event in 80ns without blocking. Tell collector routes through the zero-copy pipeline and writes to local disk with LZ4 compression. Every stage is compiler-verified.
            </p>
            <p className="text-sm text-zinc-400">
              <span className="text-emerald-400 font-medium">Forwarding path:</span> Same SDK-to-collector path, with the collector fanning out to a forwarder that relays upstream using the same binary protocol — retry, keepalive, source IP preserved. Every stage is compiler-verified.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              SDKs also available in C++, Go, Swift, JavaScript, and Flutter.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-6 bg-zinc-900/30">
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
                  All functionality compiled into one executable. No runtime dependencies. No dynamic linking. Copy to host, point at config, run.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Static linking — copy to deploy</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">CycloneDX SBOM generated per build</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">No container runtime, no package manager</span></li>
                </ul>
              </div>
              <div className="bg-zinc-950 rounded-xl p-6 font-mono text-sm border border-white/5">
                <p className="text-zinc-500 mb-2"># Deploy</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> scp tell edge-node:/usr/local/bin/</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> ssh edge-node "tell run"</p>
                <p className="text-zinc-500 mt-4"># Verify supply chain</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> cargo cyclonedx --format json</p>
                <p className="text-zinc-300"><span className="text-brand">$</span> cargo audit</p>
              </div>
            </div>

            {/* Air-Gapped */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-zinc-950 rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-zinc-400">Offline — Running Indefinitely</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Syslog TCP source</span>
                    <span className="text-emerald-400">listening :514</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Disk binary sink</span>
                    <span className="text-zinc-300">LZ4, hourly rotation</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Workspace isolation</span>
                    <span className="text-zinc-300">3 workspaces active</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Internet required</span>
                    <span className="text-red-400">None</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Outbound connections</span>
                    <span className="text-red-400">None</span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-xl font-semibold mb-3">Air-Gapped Operation</h3>
                <p className="text-zinc-400 mb-4">
                  Operates fully offline. No cloud dependency. No license server. No telemetry. Logs stored locally with configurable rotation and compression. Runs indefinitely on isolated networks.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">No internet, no outbound, no phone-home</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Local disk retention with LZ4 compression</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Forward upstream when connectivity allows</span></li>
                </ul>
              </div>
            </div>

            {/* Workspace Isolation */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-3">Workspace Isolation</h3>
                <p className="text-zinc-400 mb-4">
                  Multi-tenant by design. Each workspace has its own API key. Events are isolated at ingestion — each key maps to a workspace, each workspace gets isolated storage paths. No data crosses boundaries.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">16-byte API keys with O(1) lookup</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Constant-time key comparison</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Per-workspace storage directories</span></li>
                  <li className="flex items-center gap-3 text-sm"><CheckIcon /><span className="text-zinc-300">Per-workspace metrics isolation</span></li>
                </ul>
              </div>
              <div className="bg-zinc-950 rounded-xl p-6 font-mono text-sm border border-white/5">
                <p className="text-zinc-500 mb-2"># apikeys.conf</p>
                <p className="text-zinc-300"><span className="text-zinc-500"># format: hex_key:workspace_id</span></p>
                <p className="text-zinc-300 mt-2"><span className="text-emerald-400">000102030405060708090a0b0c0d0e0f</span>:<span className="text-brand">1</span></p>
                <p className="text-zinc-300"><span className="text-emerald-400">deadbeefdeadbeefdeadbeefdeadbeef</span>:<span className="text-brand">2</span></p>
                <p className="text-zinc-300"><span className="text-emerald-400">f1e2d3c4b5a6978867452312fdecba98</span>:<span className="text-brand">3</span></p>
                <p className="text-zinc-500 mt-4"># 32 hex chars = 16 bytes per key</p>
                <p className="text-zinc-500"># Each key → workspace → isolated storage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build What You Need */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Source-Available</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Build what you need</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              The full source code is available for audit, modification, and custom builds. For OT deployments, this is a security property — not just a licensing detail.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <h3 className="font-semibold mb-4">Composable Architecture</h3>
              <p className="text-sm text-zinc-400 mb-4">Select only the components your deployment requires. Unused code is not in the binary — it cannot be exploited because it does not exist.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">Sources: TCP, Syslog TCP/UDP, HTTP</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">Sinks: Disk, Parquet, Arrow, ClickHouse, Forwarder</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">Core pipeline always included</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">Connectors, ML, transforms — optional</span></li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <h3 className="font-semibold mb-4">Auditable Supply Chain</h3>
              <p className="text-sm text-zinc-400 mb-4">Each build produces its own CycloneDX SBOM — the supply chain manifest matches exactly what is deployed, not a superset.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">Audit source code before building</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">Pinned toolchain for reproducibility</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">SBOM matching your exact deployment</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="text-emerald-500" /><span className="text-zinc-300">Every dependency traceable to source</span></li>
              </ul>
            </div>
          </div>

          <div className="p-6 bg-zinc-950 rounded-xl border border-white/5 text-center">
            <p className="text-sm text-zinc-400">
              Aligns with IEC 62443's principle of <span className="text-zinc-300 font-medium">minimal functionality</span>: only ship what is required for the operational purpose. With Tell, this is a build configuration enforced by the compiler — not a policy enforced by process.
            </p>
          </div>
        </div>
      </section>

      {/* Deployment Models */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Deployment</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Three deployment models</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Air-Gapped Collector</h3>
              <p className="text-sm text-zinc-500 mb-4">Collect from OT equipment on an isolated network. Store locally for compliance and investigation.</p>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>Syslog/TCP ingest</li>
                <li>Local disk with rotation + LZ4</li>
                <li>Workspace-isolated paths</li>
                <li>No internet, no outbound</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Zone Boundary Forwarder</h3>
              <p className="text-sm text-zinc-500 mb-4">Collect in the OT zone. Retain locally. Forward to the IT zone for centralized analysis.</p>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>Local disk as compliance copy</li>
                <li>Forwarder with retry + keepalive</li>
                <li>Source IP preserved upstream</li>
                <li>Same binary protocol end-to-end</li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Multi-Tenant (MSSP / SOC)</h3>
              <p className="text-sm text-zinc-500 mb-4">One instance, multiple customers. Workspace isolation ensures data separation at ingestion.</p>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>Per-customer API keys</li>
                <li>Workspace-scoped routing</li>
                <li>Fan-out to per-customer sinks</li>
                <li>No data crosses boundaries</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OT Configuration */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Configuration</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">TOML config, validated at startup</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Human-readable configuration. Errors caught before the binary runs, not at runtime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-950 rounded-xl p-6 font-mono text-sm border border-white/5 overflow-x-auto">
              <p className="text-zinc-500 mb-4"># config.toml</p>
              <p className="text-zinc-400">[global]</p>
              <p className="text-zinc-300 pl-4">num_processors = <span className="text-brand">4</span></p>
              <p className="text-zinc-300 pl-4">buffer_size = <span className="text-brand">262144</span>  <span className="text-zinc-600"># 256KB</span></p>
              <p className="text-zinc-300 pl-4">batch_size = <span className="text-brand">500</span></p>
              <p className="text-zinc-300 pl-4">api_keys_file = <span className="text-emerald-400">"configs/apikeys.conf"</span></p>
              <p className="text-zinc-400 mt-3">[[sources.syslog_tcp]]</p>
              <p className="text-zinc-300 pl-4">address = <span className="text-emerald-400">"127.0.0.1"</span>  <span className="text-zinc-600"># configurable</span></p>
              <p className="text-zinc-300 pl-4">port = <span className="text-brand">514</span></p>
              <p className="text-zinc-400 mt-3">[[sinks.disk_binary]]</p>
              <p className="text-zinc-300 pl-4">path = <span className="text-emerald-400">"/var/log/tell"</span></p>
              <p className="text-zinc-300 pl-4">rotation = <span className="text-emerald-400">"hourly"</span></p>
              <p className="text-zinc-300 pl-4">compression = <span className="text-emerald-400">"lz4"</span></p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Bind Address Per Source</h3>
                <p className="text-sm text-zinc-400 mb-3">Every source has a configurable bind address. Restrict to localhost, a specific interface, or open as needed.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Fixed processor count (predictable resources)</span></li>
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Configurable buffers and batch size</span></li>
                  <li className="flex items-center gap-3"><CheckIcon /><span className="text-zinc-300">Structured JSON logging for auditing</span></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Storage Options</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><span className="text-zinc-300">disk_binary</span> — LZ4 compressed, high throughput</li>
                  <li><span className="text-zinc-300">disk_plaintext</span> — Human-readable, daily/hourly rotation</li>
                  <li><span className="text-zinc-300">parquet</span> — Columnar, Zstd/Snappy/LZ4</li>
                  <li><span className="text-zinc-300">arrow_ipc</span> — Columnar, query with DuckDB or Polars</li>
                  <li><span className="text-zinc-300">clickhouse</span> — Columnar analytics database</li>
                  <li><span className="text-zinc-300">forwarder</span> — Relay upstream with retry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">Compliance</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Designed for regulatory environments</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Architected to support CRA, NIS2, and IEC 62443 requirements for critical infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">EU Cyber Resilience Act</p>
              <h3 className="font-semibold mb-4">CRA</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Security by design — Rust compiler eliminates memory and thread safety vulnerabilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Supply chain transparency — CycloneDX SBOM per build</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Vulnerability handling — cargo audit for CVE monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Minimal functionality — build profiles exclude unused code</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">Network & Information Security</p>
              <h3 className="font-semibold mb-4">NIS2</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Log retention — configurable rotation, compression, workspace isolation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Incident detection — real-time metrics, live tail monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Access controls — API key auth, workspace isolation, RBAC</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Supply chain — SBOM per build, dependency CVE monitoring</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">Industrial Security</p>
              <h3 className="font-semibold mb-4">IEC 62443</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Zone/conduit architecture — pipeline maps to zone boundaries</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Deterministic operation — 84ns latency, no GC, zero-copy</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Minimal functionality — unused components not in the binary</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="text-emerald-500 mt-0.5" />
                  <span className="text-zinc-400">Availability — graceful shutdown, atomic rotation, retry on failure</span>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Deterministic, not best-effort</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">64M</p>
              <p className="text-sm text-zinc-500">events/sec</p>
              <p className="text-xs text-zinc-600">TCP binary, sustained</p>
            </div>
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">84ns</p>
              <p className="text-sm text-zinc-500">per event</p>
              <p className="text-xs text-zinc-600">zero-copy pipeline</p>
            </div>
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">80ns</p>
              <p className="text-sm text-zinc-500">SDK call latency</p>
              <p className="text-xs text-zinc-600">fire-and-forget</p>
            </div>
            <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-3xl font-bold text-brand mb-2">0</p>
              <p className="text-sm text-zinc-500">GC pauses</p>
              <p className="text-xs text-zinc-600">no runtime</p>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-sm text-zinc-500 mb-3">Throughput by source</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">TCP binary (FlatBuffers)</span>
                  <span className="text-zinc-300 font-medium">64M events/sec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">HTTP binary</span>
                  <span className="text-zinc-300 font-medium">24M events/sec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Syslog TCP</span>
                  <span className="text-zinc-300 font-medium">8.7M events/sec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">HTTP JSON</span>
                  <span className="text-zinc-300 font-medium">2.1M events/sec</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-sm text-zinc-500 mb-3">Resource guarantees</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Memory: bounded, configurable ceiling</li>
                <li>CPU: predictable, no GC spikes</li>
                <li>Latency: sub-millisecond P99</li>
                <li>Network: backpressure handling</li>
              </ul>
              <p className="text-sm text-zinc-500 mt-4 mb-2">Benchmark context</p>
              <p className="text-xs text-zinc-500">PostHog: ~100K events/sec. Vector: 86 MiB/s. Tell sustains 64M events/sec — processing 13 GB/s of event data.</p>
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
            Talk to our team about deployment in your OT environment. Source-available for evaluation and audit.
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

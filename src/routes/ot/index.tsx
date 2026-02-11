import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ot/")({
  component: OTPage,
  head: () => ({
    meta: [
      { title: "Tell for OT — Secure Log Collection for Critical Infrastructure" },
      { name: "description", content: "Zero CVEs. Memory-safe log collection for air-gapped OT networks. Single binary, 2.8 MB. Designed for CRA, NIS2, IEC 62443." },
      { property: "og:title", content: "Tell for OT — Zero CVEs. By design." },
      { property: "og:description", content: "Zero CVEs. Memory-safe log collection for air-gapped OT networks. Single binary, 2.8 MB. Built in Rust — recommended by CISA, NSA, and the EU Cyber Resilience Act." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tell.rs/ot" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tell for OT — Zero CVEs. By design." },
      { name: "twitter:description", content: "Memory-safe log collection for air-gapped OT networks. Single binary, 2.8 MB." },
    ],
  }),
});

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function OTPage() {
  return (
    <>
      {/* ── HERO (dark) ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand/4 rounded-full blur-[200px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-brand mb-12">
            For Critical Infrastructure
          </p>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[0.95]">
            Zero CVEs.
            <br />
            <span className="text-zinc-500 italic">By design.</span>
          </h1>

          <p className="mt-12 text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Log collection for air-gapped OT networks. Built in Rust — the memory-safe language recommended by CISA, NSA, and the EU Cyber Resilience Act for critical infrastructure.
          </p>

          <div className="mt-16 flex items-center justify-center gap-8 sm:gap-12">
            {[
              { value: "64M", label: "events/sec" },
              { value: "84ns", label: "latency" },
              { value: "2.8 MB", label: "binary" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-8 sm:gap-12">
                {i > 0 && <div className="w-px h-12 bg-zinc-800" />}
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-[11px] text-zinc-500 mt-1 tracking-wider uppercase">{s.label}</p>
                </div>
              </div>
            ))}
            <div className="w-px h-12 bg-zinc-800" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400">0</p>
              <p className="text-[11px] text-zinc-500 mt-1 tracking-wider uppercase">CVEs</p>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ot@tell.rs?subject=Tell%20for%20OT%20-%20Demo%20Request"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand text-white rounded-full font-semibold hover:bg-brand/90 transition-colors text-sm tracking-wide"
            >
              Request Demo
              <Arrow />
            </a>
            <Link
              to="/ot/whitepaper"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-white rounded-full font-semibold hover:bg-white/5 transition-colors border border-white/15 text-sm tracking-wide"
            >
              Technical Whitepaper
              <Arrow />
            </Link>
          </div>

          <p className="mt-24 text-sm text-zinc-600">
            Built by the founder of Logpoint · Self-host anywhere
          </p>
        </div>
      </section>

      {/* ── MEMORY SAFETY (dark) ── */}
      <section className="py-28 sm:py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.1] mb-8">
            Memory safety is not optional<br className="hidden sm:block" /> in critical infrastructure
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mb-16">
            These are the vulnerability classes behind the CVE lists of Splunk, Elastic, Wazuh, and every C, C++, and Java-based collector deployed in OT environments today. In Tell, they are rejected at compile time — they do not exist in the shipped binary.
          </p>

          <div className="flex flex-wrap gap-3 mb-24">
            {["Buffer overflow", "Use-after-free", "Double-free", "Data races", "Null dereference", "Uninitialized memory"].map((v) => (
              <span key={v} className="px-5 py-2.5 text-sm bg-emerald-500/8 border border-emerald-500/15 rounded-full text-emerald-400">
                {v}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { stat: "70%", desc: "of Microsoft CVEs are memory safety vulnerabilities", src: "Microsoft MSRC, 2019" },
              { stat: "67%", desc: "of Chrome critical vulnerabilities are memory safety", src: "Google Project Zero" },
              { stat: "76% → 24%", desc: "Android memory safety bugs after Rust adoption", src: "Google, 2024" },
            ].map((item) => (
              <div key={item.stat} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                <p className="text-4xl text-zinc-200 mb-3">{item.stat}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                <p className="text-[11px] text-zinc-700 mt-3">{item.src}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PRODUCT (light) ── */}
      <section className="py-28 sm:py-40 px-6 bg-[#F8F7F4]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1a1a1a] leading-[1.1] mb-8">
            Single binary.
            <br className="hidden sm:block" />
            <span className="text-[#999] italic">Air-gapped by default.</span>
          </h2>
          <p className="text-lg text-[#666] leading-relaxed max-w-2xl mb-20">
            Copy to host. Point at config. Run. No internet, no license server, no telemetry, no runtime dependencies. Tell runs indefinitely on isolated networks.
          </p>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-14 mb-24">
            {[
              { title: "Air-Gapped Operation", text: "No outbound connections. License validated locally via JWT token. Telemetry disabled by config. Local disk retention with LZ4 compression. Runs indefinitely on isolated networks." },
              { title: "Workspace Isolation", text: "Multi-tenant by design. API key authentication with isolated storage paths and metrics per customer. One instance, strict data separation. Built for MSSPs and shared SOCs." },
              { title: "Minimal Attack Surface", text: "The OT collector ships only the components it needs: syslog ingest, disk storage, optional forwarding. 2.8 MB binary. Code that isn't included cannot be exploited." },
              { title: "Full-Path Integrity", text: "The Rust SDK extends memory-safety guarantees from instrumentation to storage — the fastest and most secure integration path. SDKs also available in C++, Go, Swift, JavaScript, and Flutter." },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">{item.title}</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Deployment models */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {[
              { profile: "ot-collector · 2.8 MB", name: "Collector", desc: "TCP + syslog ingest, local disk with LZ4 and hourly rotation, optional forwarding. For edge nodes on isolated networks." },
              { profile: "ot-forwarder · 2.5 MB", name: "Forwarder", desc: "TCP + syslog ingest, relay upstream with retry and keepalive. No local storage. Minimal relay for zone boundaries." },
              { profile: "full · single instance", name: "Multi-Tenant", desc: "One instance, multiple customers. API key isolation, workspace-scoped routing, per-tenant storage. For MSSPs and shared SOCs." },
            ].map((d) => (
              <div key={d.name} className="p-6 rounded-2xl border border-[#e0ddd8] bg-white">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#999] mb-4">{d.profile}</p>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">{d.name}</h3>
                <p className="text-sm text-[#777] leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>

          {/* Config */}
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="bg-[#0a0a0b] rounded-2xl p-8 font-mono text-sm border border-white/5 overflow-x-auto text-zinc-300">
              <p className="text-zinc-600 mb-4"># config.toml</p>
              <p className="text-zinc-500">[global]</p>
              <p className="pl-4">num_processors = <span className="text-brand">4</span></p>
              <p className="pl-4">batch_size = <span className="text-brand">500</span></p>
              <p className="pl-4">api_keys_file = <span className="text-emerald-400">"apikeys.conf"</span></p>
              <p className="text-zinc-500 mt-4">[[sources.syslog_tcp]]</p>
              <p className="pl-4">address = <span className="text-emerald-400">"127.0.0.1"</span></p>
              <p className="pl-4">port = <span className="text-brand">514</span></p>
              <p className="text-zinc-500 mt-4">[[sinks.disk_binary]]</p>
              <p className="pl-4">path = <span className="text-emerald-400">"/var/log/tell"</span></p>
              <p className="pl-4">rotation = <span className="text-emerald-400">"hourly"</span></p>
              <p className="pl-4">compression = <span className="text-emerald-400">"lz4"</span></p>
              <p className="text-zinc-500 mt-4">[telemetry]</p>
              <p className="pl-4">enabled = <span className="text-brand">false</span>  <span className="text-zinc-600"># air-gapped</span></p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">TOML config, validated at startup</h3>
              <p className="text-[15px] text-[#666] leading-relaxed mb-8">
                Human-readable configuration. Errors caught before the binary runs. Every source has a configurable bind address. Fixed processor count for predictable resource usage.
              </p>
              <div className="space-y-3 text-[15px] text-[#666]">
                <p><span className="text-[#1a1a1a] font-medium">disk_binary</span> — LZ4, high throughput, hourly/daily rotation</p>
                <p><span className="text-[#1a1a1a] font-medium">disk_plaintext</span> — Human-readable, split by type</p>
                <p><span className="text-[#1a1a1a] font-medium">parquet</span> — Columnar, compressed</p>
                <p><span className="text-[#1a1a1a] font-medium">arrow_ipc</span> — Columnar, queryable</p>
                <p><span className="text-[#1a1a1a] font-medium">forwarder</span> — Relay upstream with retry and keepalive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE (dark) ── */}
      <section className="py-28 sm:py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.1] mb-8">
                CRA · NIS2
                <br />
                IEC 62443
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-10">
                The EU Cyber Resilience Act requires security by design and supply chain transparency. NIS2 mandates incident logging and retention. IEC 62443 requires minimal functionality — only necessary components in deployed systems.
              </p>
              <Link
                to="/ot/whitepaper"
                className="inline-flex items-center gap-2 text-brand hover:text-brand/80 transition-colors font-medium"
              >
                Full analysis in the technical whitepaper
                <Arrow />
              </Link>
            </div>
            <div className="space-y-5">
              {[
                { label: "Security by design", text: "Built in a memory-safe language. Zero CVEs in production releases. Vulnerability classes eliminated structurally, not by policy." },
                { label: "Minimal functionality", text: "OT build profiles include only required components. Analytics, HTTP endpoints, UI, and connectors are excluded from the binary — not disabled, absent." },
                { label: "Supply chain transparency", text: "CycloneDX SBOM generated per build profile. Every dependency traceable. Pinned toolchain for reproducible builds." },
                { label: "Deterministic operation", text: "No garbage collection pauses. Sub-millisecond latency. Graceful shutdown with atomic file rotation." },
              ].map((item) => (
                <div key={item.label} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <p className="text-[11px] font-mono font-medium text-brand uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE (light) ── */}
      <section className="py-28 sm:py-40 px-6 bg-[#F8F7F4]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1a1a1a] leading-[1.1] mb-16 text-center">
            Deterministic,<br /> not best-effort
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-[#e0ddd8] bg-white">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#999] mb-6">Throughput by source</p>
              <div className="space-y-5 text-[15px]">
                {[
                  { source: "TCP binary", tp: "64M events/sec" },
                  { source: "HTTP binary", tp: "24M events/sec" },
                  { source: "Syslog TCP", tp: "8.7M events/sec" },
                  { source: "HTTP JSON", tp: "2.1M events/sec" },
                ].map((r) => (
                  <div key={r.source} className="flex justify-between items-baseline">
                    <span className="text-[#666]">{r.source}</span>
                    <span className="text-[#1a1a1a] font-medium font-mono text-sm">{r.tp}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-2xl border border-[#e0ddd8] bg-white">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#999] mb-6">Resource guarantees</p>
              <div className="space-y-5 text-[15px] text-[#666]">
                <p><span className="text-[#1a1a1a] font-medium">Memory:</span> bounded, configurable ceiling</p>
                <p><span className="text-[#1a1a1a] font-medium">CPU:</span> predictable, no spikes</p>
                <p><span className="text-[#1a1a1a] font-medium">Latency:</span> sub-millisecond P99</p>
                <p><span className="text-[#1a1a1a] font-medium">Network:</span> backpressure, retry, keepalive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA (dark) ── */}
      <section className="py-28 sm:py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/5 rounded-full blur-[200px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.1] mb-8">
            Ready to secure your<br /> infrastructure?
          </h2>
          <p className="text-lg text-zinc-400 mb-14 max-w-lg mx-auto">
            Revenue-based pricing — all features included, no per-seat fees.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ot@tell.rs?subject=Tell%20for%20OT%20-%20Demo%20Request"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand text-white rounded-full font-semibold hover:bg-brand/90 transition-colors text-sm tracking-wide"
            >
              Request Demo
              <Arrow />
            </a>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-zinc-500">
            <Link to="/ot/whitepaper" className="hover:text-white transition-colors">Whitepaper</Link>
            <span className="text-zinc-800">·</span>
            <a href="mailto:ot@tell.rs" className="hover:text-white transition-colors">ot@tell.rs</a>
          </div>
        </div>
      </section>
    </>
  );
}

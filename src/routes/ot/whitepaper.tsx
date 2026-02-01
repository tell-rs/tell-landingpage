import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ot/whitepaper")({
  component: WhitepaperPage,
  head: () => ({
    meta: [
      { title: "Secure Log Collection for OT — Technical Whitepaper — Tell" },
      { name: "description", content: "Compiler-verified security for air-gapped and compliance-heavy OT environments. CVE analysis, architecture, compliance alignment." },
      { property: "og:title", content: "Secure Log Collection for OT — Technical Whitepaper" },
      { property: "og:description", content: "Compiler-verified security for air-gapped and compliance-heavy OT environments. Single binary. No runtime dependencies." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://tell.rs/ot/whitepaper" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Secure Log Collection for OT — Technical Whitepaper" },
      { name: "twitter:description", content: "Compiler-verified security for air-gapped and compliance-heavy OT environments." },
    ],
  }),
});

function WhitepaperPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-0 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-brand/8 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Technical Whitepaper</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            Secure Log Collection for<br />Critical Infrastructure
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Compiler-verified security for air-gapped and compliance-heavy OT environments.
            Single binary. No runtime dependencies.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-zinc-500">
            <span className="font-mono text-brand">64M <span className="text-zinc-500">events/sec</span></span>
            <span className="text-zinc-700">·</span>
            <span className="font-mono text-brand">84ns <span className="text-zinc-500">latency</span></span>
            <span className="text-zinc-700">·</span>
            <span className="font-mono text-brand">Zero <span className="text-zinc-500">runtime deps</span></span>
          </div>
        </div>
      </section>

      {/* Document content - full-width light background */}
      <div className="bg-white">
        <article className="max-w-3xl mx-auto text-slate-900">
          <div className="px-6 sm:px-12 py-10 sm:py-14 space-y-0">

            {/* Executive Summary */}
            <Section>
              <H2>Executive Summary</H2>
              <P>Splunk has 252 published CVEs. Elastic has 216. Wazuh has 28, including a critical remote code execution vulnerability rated 9.9. These are not theoretical risks — they are documented in the National Vulnerability Database and affect the tools currently deployed in critical infrastructure.</P>
              <P>Many of these vulnerabilities are memory safety issues: buffer overflows, heap corruption, use-after-free. These vulnerability classes have been documented for decades. They continue to ship because the tools used to build infrastructure software do not prevent them.</P>
              <P>Tell is a log collection and analytics engine written in Rust. The Rust compiler eliminates memory safety vulnerability classes at compile time. Code containing buffer overflows, use-after-free, or data races is rejected before the binary is built. This is not a testing process or coding standard — it is a property of the compiled software.</P>
            </Section>

            <Divider />

            {/* CVE Reality Check */}
            <Section>
              <H2>CVE Reality Check</H2>
              <P>The tools currently deployed in OT environments have documented security vulnerabilities. These are not theoretical risks — they are assigned CVE numbers and published in the National Vulnerability Database.</P>

              <TableLabel>Published CVEs by Vendor (Source: OpenCVE, January 2026)</TableLabel>
              <div className="overflow-x-auto -mx-6 sm:-mx-12">
                <div className="px-6 sm:px-12">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <Th>Vendor</Th>
                        <Th>CVEs</Th>
                        <Th>Memory Safety Issues</Th>
                        <Th>Critical Examples</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <Tr><Td>Splunk</Td><Td className="font-semibold">252</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td>RCE via XSLT, SSRF, privilege escalation</Td></Tr>
                      <Tr><Td>Elastic Stack</Td><Td className="font-semibold">216</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td>Buffer overflow in Filebeat syslog parser</Td></Tr>
                      <Tr><Td>Wazuh</Td><Td className="font-semibold">28</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td>Heap overflow, use-after-free, RCE (9.9)</Td></Tr>
                      <Tr><Td>Logpoint</Td><Td className="font-semibold">25</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td>SSRF (9.6 Critical), template injection RCE</Td></Tr>
                      <Tr><Td>Graylog</Td><Td className="font-semibold">17</Td><Td className="text-amber-600 font-mono text-xs">Some</Td><Td>Session leak (9.8), privilege escalation</Td></Tr>
                      <Tr><Td>syslog-ng</Td><Td className="font-semibold">9</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td>Integer overflow in RFC3164 parser</Td></Tr>
                      <Tr><Td>CrowdStrike</Td><Td className="font-semibold">5</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td>TLS validation flaw (8.1), race conditions</Td></Tr>
                      <Tr><Td>LogRhythm</Td><Td className="font-semibold">4</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td>Command injection (9.8 Critical)</Td></Tr>
                      <tr className="bg-emerald-50/60">
                        <Td className="font-semibold">Tell</Td>
                        <Td className="font-bold text-emerald-700">0</Td>
                        <Td className="text-emerald-700 font-mono text-xs">N/A</Td>
                        <Td className="text-emerald-700">Rust compiler prevents these classes</Td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Callout title="Why This Matters for OT">
                Many of these CVEs are memory safety vulnerabilities: buffer overflows, heap corruption, use-after-free. These are the vulnerability classes that Rust eliminates at compile time. Wazuh CVE-2025-62786 is a heap-based out-of-bounds write that can lead to remote code execution. Elastic CVE-2025-68383 is a buffer overflow in the syslog parser. These vulnerabilities cannot exist in Tell — the Rust compiler rejects the code paths that produce them.
              </Callout>
            </Section>

            <Divider />

            {/* The Security Problem */}
            <Section>
              <H2>The Security Problem</H2>
              <P>Log collectors occupy a privileged position in network architecture. They sit on perimeters, process untrusted input from external devices, and often bridge zone boundaries between equipment networks and IT infrastructure.</P>

              <Pullquote
                text="&ldquo;70% of all Microsoft security vulnerabilities are memory safety issues.&rdquo;"
                cite="Microsoft Security Response Center, 2019"
              />

              <P>Buffer overflows, use-after-free, and data races are the attack vectors behind Stuxnet, Dirty Pipe, and the majority of CVEs issued against infrastructure software annually. JVM-based collectors add garbage collection pauses — during traffic spikes, logs may be lost while the collector is paused.</P>
            </Section>

            <Divider />

            {/* Compiler-Verified Security */}
            <Section>
              <H2>Compiler-Verified Security</H2>
              <P>Tell is written in Rust, a systems programming language jointly recommended by CISA, NSA, and the EU Cyber Resilience Act for critical infrastructure. Rust's compiler enforces memory safety and thread safety as part of compilation.</P>

              <Callout title="What the Compiler Prevents">
                Buffer overflows, use-after-free, double-free, data races, null pointer dereferences, and uninitialized memory access. The code paths that would produce them cannot compile.
              </Callout>

              {/* Same Function, Different Outcome */}
              <Diagram title="Same Function, Different Outcome">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">Elastic Filebeat</div>
                    <div className="font-mono text-sm text-slate-300">
                      <span className="text-red-400 font-semibold">CVE-2025-68383</span><br />
                      Buffer overflow in<br />syslog parser
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-orange-400 text-lg font-mono sm:rotate-0 rotate-90 py-2 sm:py-0">vs</div>
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">Tell</div>
                    <div className="font-mono text-sm text-slate-300">
                      <span className="text-emerald-400 font-semibold">Not possible</span><br />
                      Rust bounds checking<br />at compile time
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-500 mt-4 pt-3 border-t border-white/10">
                  Both products parse syslog. One has a buffer overflow vulnerability. The other cannot — the compiler rejects the code that would produce it.
                </div>
              </Diagram>

              <TableLabel>Vulnerability Comparison by Language</TableLabel>
              <div className="overflow-x-auto -mx-6 sm:-mx-12">
                <div className="px-6 sm:px-12">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <Th>Vulnerability</Th>
                        <Th>C / C++</Th>
                        <Th>JVM</Th>
                        <Th>Rust (Tell)</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <Tr><Td>Buffer overflow</Td><Td className="text-red-600 font-mono text-xs">Possible</Td><Td className="text-amber-600 font-mono text-xs">Runtime</Td><Td className="text-emerald-700 font-mono text-xs font-semibold">Compile-time</Td></Tr>
                      <Tr><Td>Use-after-free</Td><Td className="text-red-600 font-mono text-xs">Possible</Td><Td className="text-amber-600 font-mono text-xs">GC</Td><Td className="text-emerald-700 font-mono text-xs font-semibold">Compile-time</Td></Tr>
                      <Tr><Td>Data races</Td><Td className="text-red-600 font-mono text-xs">Possible</Td><Td className="text-red-600 font-mono text-xs">Possible</Td><Td className="text-emerald-700 font-mono text-xs font-semibold">Compile-time</Td></Tr>
                      <Tr><Td>Null dereference</Td><Td className="text-red-600 font-mono text-xs">Possible</Td><Td className="text-red-600 font-mono text-xs">NPE</Td><Td className="text-emerald-700 font-mono text-xs font-semibold">Compile-time</Td></Tr>
                      <Tr><Td>GC pauses</Td><Td className="text-slate-400">N/A</Td><Td className="text-red-600 font-mono text-xs">Yes</Td><Td className="text-slate-400">N/A</Td></Tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <H3>Full-Path Integrity</H3>
              <P>When using the Rust SDK, Tell's safety guarantees extend across the entire data path — from instrumentation to storage.</P>

              <Diagram title="Compiler-Verified Data Path">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">SDK Call</div>
                    <div className="font-mono text-sm text-slate-300"><span className="text-orange-400 font-semibold">80ns</span><br />serialize, encode, enqueue</div>
                  </div>
                  <div className="flex items-center justify-center text-orange-400 text-lg sm:rotate-0 rotate-90 py-2 sm:py-0">→</div>
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">Pipeline</div>
                    <div className="font-mono text-sm text-slate-300"><span className="text-orange-400 font-semibold">Zero-copy</span><br />O(1) routing, fan-out</div>
                  </div>
                  <div className="flex items-center justify-center text-orange-400 text-lg sm:rotate-0 rotate-90 py-2 sm:py-0">→</div>
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">Storage</div>
                    <div className="font-mono text-sm text-slate-300"><span className="text-orange-400 font-semibold">Atomic</span><br />disk / forward / both</div>
                  </div>
                </div>
                <div className="text-sm text-slate-500 mt-4 pt-3 border-t border-white/10">
                  SDKs also available in C++, Go, Swift, JavaScript, and Flutter. The C++ SDK follows the same architecture but cannot offer compile-time safety guarantees.
                </div>
              </Diagram>
            </Section>

            <Divider />

            {/* Architecture */}
            <Section>
              <H2>Architecture</H2>
              <P>Data enters through sources, passes through a routing layer, and fans out to sinks. The entire pipeline operates on zero-copy buffers — data flows from network socket to storage without duplication.</P>

              <Diagram title="Pipeline Architecture">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">Sources</div>
                    <div className="font-mono text-sm text-slate-300 leading-7">TCP (binary)<br />HTTP (JSON/binary)<br />Syslog TCP/UDP</div>
                  </div>
                  <div className="flex items-center justify-center text-orange-400 text-lg sm:rotate-0 rotate-90 py-2 sm:py-0">→</div>
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">Routing</div>
                    <div className="font-mono text-sm text-slate-300 leading-7">O(1) lookup<br />Fan-out<br />Workspace isolation</div>
                  </div>
                  <div className="flex items-center justify-center text-orange-400 text-lg sm:rotate-0 rotate-90 py-2 sm:py-0">→</div>
                  <div className="flex-1 bg-slate-800 border border-white/10 p-4 rounded-lg">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-orange-400 mb-2">Sinks</div>
                    <div className="font-mono text-sm text-slate-300 leading-7">Disk (binary/text)<br />ClickHouse<br />Arrow / Parquet<br />Forwarder</div>
                  </div>
                </div>
              </Diagram>

              <H3>Deployment</H3>
              <P>Tell is a single static binary — the OT collector is 2.8 MB. No JVM, no garbage collector, no Python interpreter, no Docker. Copy to host, point at config, run. No internet connectivity required. No license server. No telemetry.</P>

              <H3>Performance</H3>
              <TableLabel>Throughput by Source Type</TableLabel>
              <div className="overflow-x-auto -mx-6 sm:-mx-12">
                <div className="px-6 sm:px-12">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <Th>Source</Th>
                        <Th>Protocol</Th>
                        <Th>Throughput</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <Tr><Td>TCP</Td><Td>FlatBuffers binary</Td><Td className="font-semibold">64M events/sec</Td></Tr>
                      <Tr><Td>HTTP</Td><Td>Binary</Td><Td>24M events/sec</Td></Tr>
                      <Tr><Td>Syslog TCP</Td><Td>RFC 3164/5424</Td><Td>8.7M events/sec</Td></Tr>
                      <Tr><Td>HTTP</Td><Td>JSON</Td><Td>2.1M events/sec</Td></Tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <H3>Storage Options</H3>
              <P>
                <strong>Disk binary</strong> — LZ4 compressed, 32 MiB buffer, hourly/daily rotation.{" "}
                <strong>Disk plaintext</strong> — Human-readable, split by type.{" "}
                <strong>Parquet</strong> — Zstd/Snappy/LZ4.{" "}
                <strong>Arrow IPC</strong> — Query with DuckDB/Polars.{" "}
                <strong>ClickHouse</strong> — Direct insert.{" "}
                <strong>Forwarder</strong> — Retry, keepalive, source IP preservation.
              </P>
            </Section>

            <Divider />

            {/* Deployment Models */}
            <Section>
              <H2>Deployment Models</H2>

              <ScenarioCard
                title="Air-Gapped Collector"
                subtitle="Collect logs from OT equipment on an isolated network. Retain locally for compliance."
                detail="ot-collector profile · 172 crates · 2.8 MB binary"
              >
                Equipment sends syslog or TCP data to Tell. The collector writes to local disk with hourly rotation and LZ4 compression. No internet, no outbound connections. Build with <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">--features ot-collector</code> to compile only TCP, syslog, and disk sink code.
              </ScenarioCard>

              <ScenarioCard
                title="Zone Boundary Forwarder"
                subtitle="Collect in the OT zone. Retain locally. Forward to IT zone for centralized analysis."
                detail="ot-collector profile · Disk sink + Forwarder sink"
              >
                The collector writes to disk as a compliance copy and simultaneously forwards upstream. Retry with configurable attempts, TCP keepalive, source IP preservation. Uses the same <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">ot-collector</code> build — disk and forwarder sinks are both included. For relay-only nodes that don't need local retention, the <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">ot-forwarder</code> profile (2.5 MB, 170 crates) excludes disk storage entirely.
              </ScenarioCard>

              <ScenarioCard
                title="Multi-Tenant Collection"
                subtitle="Single instance serving multiple customers with strict data separation."
                detail="HTTP source → Per-workspace disk sinks"
              >
                Each tenant authenticates with a dedicated API key mapping to an isolated workspace. Routing directs each workspace's data to tenant-specific storage paths.
              </ScenarioCard>

              <H3>Source Availability</H3>
              <P>Tell is source-available. Full source code provided for audit, modification, and custom builds. Each build profile generates a CycloneDX SBOM — the OT collector profile has 172 crate dependencies; the full platform build has 588. Customers audit exactly what ships.</P>
            </Section>

            <Divider />

            {/* Compliance Alignment */}
            <Section>
              <H2>Compliance Alignment</H2>

              <H3>EU Cyber Resilience Act</H3>
              <div className="overflow-x-auto -mx-6 sm:-mx-12">
                <div className="px-6 sm:px-12">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <Th className="w-[35%]">Requirement</Th>
                        <Th>Implementation</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <Tr><Td>Security by design</Td><Td>Rust compiler eliminates memory safety and thread safety vulnerability classes</Td></Tr>
                      <Tr><Td>Supply chain transparency</Td><Td>CycloneDX SBOM generated per build</Td></Tr>
                      <Tr><Td>Vulnerability handling</Td><Td><code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">cargo audit</code> for CVE monitoring</Td></Tr>
                      <Tr><Td>Minimal functionality</Td><Td>OT profiles compile only required components: <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">ot-collector</code> (172 crates, 2.8 MB) and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">ot-forwarder</code> (170 crates, 2.5 MB). Analytics, TUI, HTTP source, connectors excluded.</Td></Tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <H3>IEC 62443</H3>
              <div className="overflow-x-auto -mx-6 sm:-mx-12">
                <div className="px-6 sm:px-12">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <Th className="w-[35%]">Principle</Th>
                        <Th>Implementation</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <Tr><Td>Zone/conduit architecture</Td><Td>Pipeline maps to zone boundaries; forwarder for conduits</Td></Tr>
                      <Tr><Td>Authentication</Td><Td>16-byte API keys, O(1) lookup, constant-time comparison</Td></Tr>
                      <Tr><Td>Deterministic operation</Td><Td>No GC, no runtime; 84ns latency, zero-copy pipeline</Td></Tr>
                      <Tr><Td>Minimal functionality</Td><Td>Composable build profiles: OT collector (172 crates) excludes analytics, HTTP, TUI, connectors</Td></Tr>
                      <Tr><Td>Availability</Td><Td>Graceful shutdown, atomic file rotation, retry on failure</Td></Tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <H3>NIS2 Directive</H3>
              <div className="overflow-x-auto -mx-6 sm:-mx-12">
                <div className="px-6 sm:px-12">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <Th className="w-[35%]">Requirement</Th>
                        <Th>Implementation</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <Tr><Td>Log retention</Td><Td>Disk sinks with configurable rotation and compression</Td></Tr>
                      <Tr><Td>Access controls</Td><Td>API key authentication, workspace isolation, RBAC</Td></Tr>
                      <Tr><Td>Supply chain security</Td><Td>Per-build SBOM, dependency CVE monitoring</Td></Tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Divider />

            {/* Why Existing Solutions Don't Fit OT */}
            <Section>
              <H2>Why Existing Solutions Don't Fit OT</H2>
              <P>Beyond CVE counts, the architecture of existing solutions creates operational and security challenges in OT environments.</P>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <CompetitorCard name="Elastic / ELK" cves="216 CVEs" issues={[
                  "Buffer overflow in Filebeat syslog parser (CVE-2025-68383)",
                  "Buffer overflows in Packetbeat protocol parsers",
                  "Java-based — GC pauses cause log loss",
                  "Complex multi-component architecture",
                ]} />
                <CompetitorCard name="Splunk" cves="252 CVEs" issues={[
                  "Remote code execution via XSLT (CVE-2023-46214)",
                  "SSRF allowing unauthorized API calls",
                  "Enterprise pricing, cloud dependency",
                  "Heavy operational burden",
                ]} />
                <CompetitorCard name="Wazuh" cves="28 CVEs" issues={[
                  "Critical RCE via deserialization (CVE-2025-24016, 9.9)",
                  "Heap buffer overflow, use-after-free vulnerabilities",
                  "Buffer over-read in message parsing",
                  "Written in C — memory safety issues",
                ]} />
                <CompetitorCard name="CrowdStrike" cves="5 CVEs" issues={[
                  "TLS validation flaw enabling MITM (CVE-2025-1146, 8.1)",
                  "Race conditions in Falcon sensor",
                  "Requires bidirectional cloud connectivity",
                  "Upstream connection = expanded attack surface",
                ]} />
              </div>

              <Callout title="On Upstream Integrations">
                Some deployments consider forwarding logs to cloud-based platforms like CrowdStrike. This introduces bidirectional network connectivity to OT environments — expanding the attack surface. CrowdStrike's own TLS validation vulnerability (CVE-2025-1146) demonstrates that even security vendors have implementation flaws. Tell's architecture supports air-gapped operation with optional one-way forwarding, minimizing exposure.
              </Callout>

              <TableLabel>Feature Comparison</TableLabel>
              <div className="overflow-x-auto -mx-6 sm:-mx-12">
                <div className="px-6 sm:px-12">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <Th>Capability</Th>
                        <Th>Tell</Th>
                        <Th>Elastic</Th>
                        <Th>Splunk</Th>
                        <Th>Wazuh</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <Tr><Td>Published CVEs</Td><Td className="text-emerald-700 font-semibold">0</Td><Td className="text-red-600">216</Td><Td className="text-red-600">252</Td><Td className="text-red-600">28</Td></Tr>
                      <Tr><Td>Memory-safe language</Td><Td className="text-emerald-700 font-semibold">Rust</Td><Td className="text-slate-400">Java</Td><Td className="text-slate-400">C++/Python</Td><Td className="text-slate-400">C</Td></Tr>
                      <Tr><Td>Single binary</Td><Td className="text-emerald-700 font-semibold">✓</Td><Td className="text-slate-300">—</Td><Td className="text-slate-300">—</Td><Td className="text-slate-300">—</Td></Tr>
                      <Tr><Td>No GC pauses</Td><Td className="text-emerald-700 font-semibold">✓</Td><Td className="text-slate-300">—</Td><Td className="text-slate-300">—</Td><Td className="text-emerald-700 font-semibold">✓</Td></Tr>
                      <Tr><Td>Air-gap capable</Td><Td className="text-emerald-700 font-semibold">✓</Td><Td className="text-amber-600">Limited</Td><Td className="text-amber-600">Limited</Td><Td className="text-emerald-700 font-semibold">✓</Td></Tr>
                      <Tr><Td>Workspace isolation</Td><Td className="text-emerald-700 font-semibold">✓</Td><Td className="text-slate-300">—</Td><Td className="text-emerald-700 font-semibold">✓</Td><Td className="text-slate-300">—</Td></Tr>
                      <Tr><Td>SBOM per build</Td><Td className="text-emerald-700 font-semibold">✓</Td><Td className="text-slate-300">—</Td><Td className="text-slate-300">—</Td><Td className="text-slate-300">—</Td></Tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                CVE data from <a href="https://app.opencve.io" className="text-orange-700 hover:underline">OpenCVE</a>, January 2026. Tell CVE count reflects vulnerabilities in production releases.
              </p>
            </Section>

            <Divider />

            {/* Pricing */}
            <Section>
              <H2>Pricing</H2>
              <P>Revenue-based. All features included. No per-seat fees.</P>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-lg overflow-hidden my-6">
                <PricingTier name="Free" price="€0" criteria="< €100K ARR" highlighted />
                <PricingTier name="Starter" price="€9" per="/mo" criteria="€100K – €1M" />
                <PricingTier name="Pro" price="€299" per="/mo" criteria="€1M – €10M" />
                <PricingTier name="Enterprise" price="Custom" criteria="> €10M ARR" />
              </div>

              <P><strong>Government, education, non-profit:</strong> Contact for special terms.</P>
            </Section>

            <Divider />

            {/* Next Steps CTA */}
            <Section>
              <div className="bg-orange-700 text-white rounded-lg p-6 sm:p-8">
                <h3 className="text-lg font-semibold mb-6">Next Steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/15 rounded-lg p-4">
                    <div className="font-mono text-xs opacity-70 mb-2">01</div>
                    <div className="font-semibold mb-1">Technical Review</div>
                    <div className="text-sm opacity-85 leading-snug">60-minute call. Architecture, security, requirements.</div>
                  </div>
                  <div className="bg-white/15 rounded-lg p-4">
                    <div className="font-mono text-xs opacity-70 mb-2">02</div>
                    <div className="font-semibold mb-1">Pilot</div>
                    <div className="text-sm opacity-85 leading-snug">Self-hosted. Syslog integration, local retention.</div>
                  </div>
                  <div className="bg-white/15 rounded-lg p-4">
                    <div className="font-mono text-xs opacity-70 mb-2">03</div>
                    <div className="font-semibold mb-1">Production</div>
                    <div className="text-sm opacity-85 leading-snug">Zone forwarding, multi-workspace, compliance.</div>
                  </div>
                </div>
              </div>
              <P><strong>Pilot requirements:</strong> Linux host, network access to sources, 30 minutes setup.</P>
            </Section>

            {/* About */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Built by the founder of Logpoint, the European SIEM platform (acquired). 15+ years in security information management. Tell applies that experience to operational technology: air-gapped networks, compliance requirements, and secure-by-design infrastructure.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm">
                <a href="mailto:ot@tell.rs" className="text-orange-700 hover:underline">ot@tell.rs</a>
                <Link to="/ot" className="text-orange-700 hover:underline">tell.rs/ot</Link>
                <a href="https://github.com/tell-rs/tell" target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:underline">GitHub</a>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                CVE data independently verifiable at <a href="https://app.opencve.io" className="text-orange-700 hover:underline">app.opencve.io</a>. Data retrieved January 2026.
              </p>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

/* ── Reusable components ── */

function Section({ children }: { children: React.ReactNode }) {
  return <section className="py-2">{children}</section>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] text-slate-700 leading-relaxed mb-4 last:mb-0">{children}</p>;
}

function Divider() {
  return <hr className="border-slate-200 my-8" />;
}

function TableLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2 mt-6">{children}</p>;
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`font-mono text-[10px] font-semibold uppercase tracking-wider text-left px-3 py-2.5 text-slate-500 border-b border-slate-200 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 border-b border-slate-100 text-slate-700 ${className}`}>{children}</td>;
}

function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="last:border-0">{children}</tr>;
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 border-l-3 border-orange-600 pl-4 pr-4 py-3 my-6 rounded-r-md">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-orange-700 mb-2">{title}</div>
      <p className="text-[15px] text-slate-700 leading-relaxed">{children}</p>
    </div>
  );
}

function Pullquote({ text, cite }: { text: string; cite: string }) {
  return (
    <div className="my-8 py-6 border-t border-b border-slate-200">
      <p className="text-xl font-medium text-slate-900 leading-snug mb-3">{text}</p>
      <p className="font-mono text-xs text-slate-500">{cite}</p>
    </div>
  );
}

function Diagram({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 text-white rounded-lg p-5 my-6">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-orange-400 mb-4">{title}</div>
      {children}
    </div>
  );
}

function ScenarioCard({ title, subtitle, detail, children }: { title: string; subtitle: string; detail: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 rounded-lg p-5 my-4">
      <div className="font-semibold text-slate-900 mb-1">{title}</div>
      <div className="text-sm text-slate-500 mb-3">{subtitle}</div>
      <p className="text-[15px] text-slate-700 leading-relaxed mb-3">{children}</p>
      <span className="inline-block font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded">{detail}</span>
    </div>
  );
}

function CompetitorCard({ name, cves, issues }: { name: string; cves: string; issues: string[] }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-slate-900">{name}</span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-red-50 text-red-600 rounded">{cves}</span>
      </div>
      <ul className="space-y-1.5">
        {issues.map((issue, i) => (
          <li key={i} className="text-sm text-slate-600 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">{issue}</li>
        ))}
      </ul>
    </div>
  );
}

function PricingTier({ name, price, per, criteria, highlighted }: { name: string; price: string; per?: string; criteria: string; highlighted?: boolean }) {
  return (
    <div className={`p-5 text-center ${highlighted ? "bg-orange-50" : "bg-white"}`}>
      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">{name}</div>
      <div className="text-2xl font-semibold text-slate-900">{price}{per && <span className="text-base font-normal text-slate-500">{per}</span>}</div>
      <div className="text-xs text-slate-500 mt-2">{criteria}</div>
    </div>
  );
}

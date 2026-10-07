import { BRAND_ICONS } from "./brand-icons";

const GH = "https://github.com/tell-rs";
const DOCS = "https://docs.tell.rs";

type DataType = { title: string; blurb: string; icon: React.ReactNode };

const DATA_TYPES: DataType[] = [
  {
    title: "Product events",
    blurb: "Track, identify, revenue. Funnels and retention on top.",
    icon: (
      <>
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Web traffic",
    blurb: "Page views, sessions, referrers. No cookie banner.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
      </>
    ),
  },
  {
    title: "Logs",
    blurb: "Structured app logs, syslog from any device, PII redacted in flight.",
    icon: <path d="M4 5h16M4 10h16M4 15h10M4 20h7" />,
  },
  {
    title: "Metrics",
    blurb: "CPU, memory, disk, network and containers, every 15 seconds.",
    icon: (
      <>
        <path d="M3 17l5-6 4 3 4-6 5 4" />
        <path d="M3 21h18" />
      </>
    ),
  },
  {
    title: "Business snapshots",
    blurb: "MRR, orders, stars, ad spend. Pulled on a schedule, kept as history.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18" />
      </>
    ),
  },
  {
    title: "Your databases",
    blurb: "Join against tables that stay where they are. Nothing copied.",
    icon: (
      <>
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
  },
];

type Way = {
  label: string;
  href: string;
  /** filled brand icon key in BRAND_ICONS */
  brand?: string;
  /** stroke icon for things without a logo */
  stroke?: React.ReactNode;
  /** caption shown under the tile */
  caption?: string;
};

const SDKS: Way[] = [
  { label: "TypeScript · web & Node", href: `${GH}/tell-js`, brand: "typescript" },
  { label: "Rust", href: `${GH}/tell-rs`, brand: "rust" },
  { label: "Go", href: `${GH}/tell-go`, brand: "go" },
  { label: "Swift", href: `${GH}/tell-swift`, brand: "swift" },
  { label: "Flutter", href: `${DOCS}/tracking/sdks/flutter`, brand: "flutter" },
  { label: "C++", href: `${GH}/tell-cpp`, brand: "cpp" },
];

const AGENTS: Way[] = [
  {
    label: "Witness",
    caption: "Witness",
    href: `${GH}/witness`,
    stroke: (
      <>
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <path d="M7 7h.01M7 17h.01" />
      </>
    ),
  },
  {
    label: "Syslog · TCP/UDP",
    caption: "Syslog",
    href: `${DOCS}/pipeline/sources/syslog`,
    stroke: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="M8 10h8M8 14h5" />
      </>
    ),
  },
  { label: "OTLP", caption: "OTLP", href: `${DOCS}/pipeline/sources/overview`, brand: "opentelemetry" },
  {
    label: "Modbus",
    caption: "Modbus",
    href: `${DOCS}/pipeline/sources/overview`,
    stroke: <path d="M4 12h3l2-6 3 12 3-9 2 3h3" />,
  },
  {
    label: "HTTP · JSON/binary",
    caption: "HTTP",
    href: `${DOCS}/pipeline/sources/http`,
    stroke: (
      <>
        <path d="M4 7h16M4 12h10M4 17h7" />
        <path d="M18 15l3 2-3 2" />
      </>
    ),
  },
];

const INTEGRATIONS = `${DOCS}/tracking/integrations`;
const CONNECTORS: Way[] = [
  { label: "Stripe", href: `${INTEGRATIONS}/overview`, brand: "stripe" },
  { label: "Shopify", href: `${INTEGRATIONS}/shopify`, brand: "shopify" },
  { label: "GitHub", href: `${INTEGRATIONS}/github`, brand: "github" },
  { label: "Cloudflare", href: `${INTEGRATIONS}/cloudflare`, brand: "cloudflare" },
  { label: "Meta Ads", href: `${INTEGRATIONS}/overview`, brand: "meta" },
  { label: "Resend", href: `${INTEGRATIONS}/resend`, brand: "resend" },
  { label: "YouTube", href: `${INTEGRATIONS}/overview`, brand: "youtube" },
  { label: "MySQL", href: `${INTEGRATIONS}/overview`, brand: "mysql" },
  { label: "Postgres", href: `${INTEGRATIONS}/overview`, brand: "postgres" },
];

function WayTile({ way }: { way: Way }) {
  return (
    <a
      href={way.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={way.label}
      className="group relative flex flex-col items-center gap-1.5"
    >
      <span className="w-11 h-11 rounded-[10px] border border-white/[0.08] bg-white/[0.03] grid place-items-center transition-colors group-hover:border-white/[0.16] group-hover:bg-white/[0.06]">
        {way.brand ? (
          <svg className="w-5 h-5 text-zinc-300/90" viewBox="0 0 24 24" fill="currentColor">
            <path d={BRAND_ICONS[way.brand]} />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {way.stroke}
          </svg>
        )}
      </span>
      {way.caption && (
        <span className="font-mono text-[10px] tracking-[0.02em] text-zinc-500">{way.caption}</span>
      )}
      {/* tooltip */}
      <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/[0.14] bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100">
        {way.label}
      </span>
    </a>
  );
}

function WayGroup({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.015] px-6 pt-5 pb-[22px]">
      <div className="flex items-baseline justify-between mb-[18px]">
        <h5 className="m-0 text-[13px] font-semibold tracking-[0.1em] uppercase text-zinc-300">{title}</h5>
        <span className="text-[13px] text-zinc-500">{hint}</span>
      </div>
      <div className="flex flex-wrap items-start gap-2">{children}</div>
    </div>
  );
}

export function SourcesSection() {
  return (
    <section id="sources" className="px-6" style={{ paddingTop: 112, paddingBottom: 120 }}>
      <div className="max-w-[1340px] mx-auto">
        {/* Head */}
        <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 items-end mb-10 md:mb-14">
          <div>
            <p className="text-[13px] font-medium tracking-[0.08em] uppercase text-brand mb-4">Sources</p>
            <h2 className="text-[36px] md:text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Most tools stop at events.
              <br />
              Tell doesn’t.
            </h2>
          </div>
          <p className="text-zinc-400 text-[17px] md:text-[22px] leading-[1.4] tracking-[-0.012em] md:pb-1">
            <span className="text-white font-medium">
              Events, web traffic, logs, metrics and business data land in one timeline.
            </span>{" "}
            When a number moves, the reason is already next to it. One tool instead of four, and no exports in between.
          </p>
        </div>

        {/* 1. What comes in */}
        <div
          className="grid grid-cols-2 lg:grid-cols-6 rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01))" }}
        >
          {DATA_TYPES.map((t, i) => (
            <div
              key={t.title}
              className={[
                "px-[22px] pt-6 pb-[22px]",
                i % 2 === 1 ? "border-l border-white/[0.08]" : "",
                i >= 2 ? "border-t border-white/[0.08]" : "",
                "lg:border-t-0",
                i > 0 ? "lg:border-l lg:border-white/[0.08]" : "",
              ].join(" ")}
            >
              <svg className="w-[22px] h-[22px] mb-[18px] text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
              <h3 className="m-0 mb-1.5 text-[16px] font-semibold tracking-[-0.01em] text-white">{t.title}</h3>
              <p className="m-0 text-[13px] leading-[1.45] text-zinc-500">{t.blurb}</p>
            </div>
          ))}
        </div>

        {/* 2. Converge */}
        <div className="relative h-10 lg:h-14" aria-hidden="true">
          <span
            className="absolute top-0 left-1/2 w-px h-full"
            style={{ background: "linear-gradient(180deg, #3f3f46, #645AE6)" }}
          />
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_auto_1fr] items-center gap-5 lg:gap-10 rounded-[14px] px-7 py-5 border border-brand/40"
          style={{
            background: "radial-gradient(90% 180% at 50% 0%, rgba(100,90,230,.22), rgba(100,90,230,.04) 60%, transparent), #0e0e12",
            boxShadow: "0 0 48px 2px rgba(100,90,230,.10), inset 0 .5px 0 rgba(255,255,255,.18)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="w-9 h-9 rounded-[10px] bg-brand grid place-items-center text-white font-bold text-[18px] tracking-[-0.03em] flex-none">T</span>
            <h4 className="m-0 text-[17px] font-semibold tracking-[-0.01em] text-white">
              Tell wire protocol
              <span className="block mt-1 text-[13px] font-normal text-zinc-400">Binary, batched, built for this. Not JSON over HTTP.</span>
            </h4>
          </div>
          <div className="flex gap-6 sm:gap-10">
            {[
              ["64M", "events / second"],
              ["30 ns", "per metric, zero allocs"],
              ["1", "binary, no cluster"],
            ].map(([n, l]) => (
              <div key={l}>
                <b className="block text-[22px] font-semibold leading-none tracking-[-0.02em] text-white">{n}</b>
                <span className="block mt-[5px] text-[12px] text-zinc-500">{l}</span>
              </div>
            ))}
          </div>
          <p className="m-0 text-[13px] leading-[1.5] text-zinc-500 lg:text-right lg:justify-self-end">
            Also speaks <b className="font-medium text-zinc-300">HTTP</b>, <b className="font-medium text-zinc-300">Syslog</b>,{" "}
            <b className="font-medium text-zinc-300">OTLP</b> and <b className="font-medium text-zinc-300">Modbus</b>.
            <br className="hidden lg:block" /> Nothing you already run has to change.
          </p>
        </div>

        {/* 3. How it gets in */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.6fr] gap-4">
          <WayGroup title="SDKs" hint="events, logs and metrics from code">
            {SDKS.map((w) => <WayTile key={w.label} way={w} />)}
          </WayGroup>
          <WayGroup title="Agents & protocols" hint="no code changes">
            {AGENTS.map((w) => <WayTile key={w.label} way={w} />)}
          </WayGroup>
          <WayGroup title="Connectors" hint="16 built in, sandboxed plugins">
            {CONNECTORS.map((w) => <WayTile key={w.label} way={w} />)}
            <a
              href={`${INTEGRATIONS}/installation`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-[10px] border border-white/[0.08] bg-white/[0.03] grid place-items-center text-[12px] font-medium text-zinc-500 transition-colors hover:border-white/[0.16] hover:text-zinc-300"
            >
              +9
            </a>
          </WayGroup>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState, useEffect, useRef, type ReactNode } from "react";
import { getAllEntries } from "../content/changelog";
import { ConnectorsGrid } from "../components/connectors-section";
import { DotGrid } from "../components/dot-grid";
import { SourcesSection } from "../components/SourcesSection";
import { Reveal } from "../components/reveal";
import { FunnelMock, LogsMock, TerminalMock, AudienceMock, ShareMock, MarketingMock } from "../components/mockups";
import {
  MockStatCard,
  MockPanelCard,
  MockToolbar,
  MockTableGrid,
  MockLine,
  MockNodeCard,
  MockCorrelationPill,
  type MockStatus,
  type MockCompare,
  type MockCorrStrength,
} from "../components/shell-kit";

function BorderGlow({ children, className = "" }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      glow.style.opacity = "1";
      glow.style.background = `radial-gradient(400px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.12), transparent 60%)`;
    };
    const onLeave = () => { glow.style.opacity = "0"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Glow border — behind content via z-0 */}
      <div
        ref={glowRef}
        className="absolute -inset-px z-0 rounded-lg pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {/* Content — above glow via z-10 */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}


export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    links: [{ rel: "canonical", href: "https://tell.rs/" }],
  }),
});

function InstallBlock() {
  const [copied, setCopied] = useState(false);
  const command = "curl -sSfL https://tell.rs | bash";

  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-3">
      <button
        onClick={copy}
        className="w-8 h-8 rounded-full bg-pill-bg flex items-center justify-center text-muted hover:bg-pill-hover hover:text-strong transition cursor-pointer shrink-0"
        title="Copy install command"
        aria-label="Copy install command"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <span className="text-[13px] font-mono font-semibold">$</span>
        )}
      </button>
      <code className="text-[15px] font-mono text-muted-foreground">{command}</code>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Log mock data                                                      */
/* ------------------------------------------------------------------ */

type LogEntry = {
  id: number;
  time: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG";
  source: string;
  tags: string[];
  body: string;
};

const seedLogs: LogEntry[] = [
  { id: 0, time: "16:04:08.342", level: "ERROR", source: "Tell", tags: ["api-gateway", "req:a8f2e1d"],
    body: `POST /v1/events 502 — {"error":"The data couldn't be read","code":"DECODE_FAILED","sdk":"ios-sdk","version":"2.4.1"}` },
  { id: 1, time: "16:04:08.221", level: "INFO", source: "Tell", tags: ["ingestion", "batch:1247"],
    body: "Batch processed: 1,247 events in 12ms — pipeline healthy, 0 dropped" },
  { id: 2, time: "16:04:08.008", level: "INFO", source: "Tell", tags: ["pipeline", "wasm-rt", "plugin:shopify-orders"],
    body: "89 transforms applied, 3 filtered by PII redaction, 0 errors" },
  { id: 3, time: "16:04:07.891", level: "WARN", source: "Tell", tags: ["connector", "github"],
    body: "Rate limit approaching: 4,812/5,000 requests — next reset in 847s, throttling to 2 req/s" },
  { id: 4, time: "16:04:07.654", level: "DEBUG", source: "Tell", tags: ["query-engine", "clickhouse", "qid:7f2a"],
    body: `SELECT count(), uniq(user_id), sum(revenue) FROM events WHERE timestamp > now() - INTERVAL 1 HOUR AND project_id = 'proj_2847' GROUP BY toStartOfMinute(timestamp) ORDER BY 1` },
  { id: 5, time: "16:04:07.432", level: "INFO", source: "Tell", tags: ["api-gateway", "web-sdk"],
    body: "POST /v1/events 200 — 1730/534/7/2/0 0/0 \"POST /events?source=web\"" },
  { id: 6, time: "16:04:07.211", level: "ERROR", source: "Tell", tags: ["connector", "stripe", "wh:evt_1P8"],
    body: `{"error":"webhook signature verification failed","endpoint":"https://tell.rs/api/webhook/stripe","status":401,"retry":true}` },
  { id: 7, time: "16:04:06.998", level: "INFO", source: "Tell", tags: ["ingestion", "batch:2103"],
    body: "Batch processed: 2,103 events in 18ms — pipeline healthy, 1 enrichment failure" },
  { id: 8, time: "16:04:06.771", level: "INFO", source: "Tell", tags: ["pipeline", "wasm-rt"],
    body: "Plugin cloudflare-analytics: 214 records synced, next page cursor saved" },
  { id: 9, time: "16:04:06.543", level: "DEBUG", source: "Tell", tags: ["storage", "clickhouse"],
    body: `Merge completed: parts 1_1_1_0 + 1_1_2_0 \u2192 1_1_2_1 (2.4 GiB, 14.2M rows), elapsed 1.23s` },
];

const logTemplates: Omit<LogEntry, "id" | "time">[] = [
  { level: "INFO", source: "Tell", tags: ["ingestion", "batch:3891"], body: "Batch processed: 3,891 events in 14ms — pipeline healthy, 0 dropped" },
  { level: "INFO", source: "Tell", tags: ["pipeline", "wasm-rt", "plugin:github-events"], body: "47 webhooks processed, 12 mapped to user events, 35 system events" },
  { level: "WARN", source: "Tell", tags: ["storage", "clickhouse", "qid:9c4e"], body: `Slow query: 842ms — SELECT uniq(user_id), count() FROM events WHERE project_id = 'proj_1284' AND timestamp > now() - INTERVAL 7 DAY` },
  { level: "DEBUG", source: "Tell", tags: ["api-gateway", "web-sdk"], body: "Connection pool: 73/100 active, 12 idle, avg latency 2.1ms" },
  { level: "ERROR", source: "Tell", tags: ["connector", "shopify", "shop:mystore"], body: `{"error":"API rate limit exceeded","retry_after":30,"endpoint":"/admin/api/2024-01/orders.json"}` },
  { level: "INFO", source: "Tell", tags: ["api-gateway", "flutter-sdk"], body: "POST /v1/events 200 — batch of 412 events, 3 enriched, gzip 14.2KB" },
  { level: "INFO", source: "Tell", tags: ["pipeline", "wasm-rt", "plugin:stripe-payments"], body: "23 charges synced, $4,891.00 total, 2 refunds" },
  { level: "DEBUG", source: "Tell", tags: ["query-engine", "clickhouse"], body: "Index scan: 12M rows in 34ms, 847 granules, mark cache hit 99.2%" },
];

// 24h at 15-min intervals = 96 bars, 3-layer stacked: error (bottom), info (middle), debug (top)
const logHistogram = (() => {
  let s = 42;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
  const bars: { err: number; warn: number; info: number; debug: number }[] = [];
  for (let i = 0; i < 96; i++) {
    const hour = i / 4;
    const dayFactor = hour >= 4 && hour <= 18 ? 0.6 + 0.4 * Math.sin((hour - 4) / 14 * Math.PI) : 0.15 + rand() * 0.1;
    const err = rand() > 0.78 ? Math.round(2 + rand() * 8) : 0;
    const warn = rand() > 0.55 ? Math.round(2 + rand() * 6) : 0;
    const info = Math.round(12 + dayFactor * 40 + rand() * 10);
    const debug = Math.round(8 + dayFactor * 25 + rand() * 8);
    bars.push({ err, warn, info, debug });
  }
  return bars;
})();

const levelColor: Record<string, string> = {
  ERROR: "text-red-400",
  WARN: "text-amber-400",
  INFO: "text-brand",
  DEBUG: "text-zinc-500",
};

const levelBadgeBg: Record<string, string> = {
  ERROR: "bg-red-400/15 text-red-400",
  WARN: "bg-amber-400/15 text-amber-400",
  INFO: "bg-brand/15 text-brand",
  DEBUG: "bg-zinc-700 text-zinc-400",
};

const detailJson = `{
  "context": {
    "runtime": {
      "file": "lib/ingestion/batch_processor.rb",
      "frame_label": "process_batch",
      "line": 42,
      "thread_id": 218880
    },
    "request": {
      "method": "POST",
      "path": "/v1/events",
      "ip": "72.93.242.93"
    }
  },
  "system": {
    "hostname": "worker3.tell.rs",
    "pid": 1847
  },
  "dt": "2025-03-14T16:04:08.342Z",
  "level": "error",
  "message": "The data couldn't be read"
}`;

/* ------------------------------------------------------------------ */
/*  User mock data                                                     */
/* ------------------------------------------------------------------ */

type UserEntry = {
  id: number;
  name: string;
  email: string;
  initials: string;
  color: string;
  lastSeen: string;
  plan: "Free" | "Pro" | "Enterprise";
  mrr: number;
  sessions: number;
  country: string;
  signupDate: string;
  activity: { action: string; time: string }[];
};

const seedUsers: UserEntry[] = [
  { id: 0, name: "Sarah Chen", email: "sarah@bigcorp.com", initials: "SC", color: "bg-zinc-600", lastSeen: "2 min ago", plan: "Pro", mrr: 99, sessions: 142, country: "US", signupDate: "Jan 14, 2025",
    activity: [{ action: "AI query: weekly churn breakdown", time: "2m ago" }, { action: "Viewed board: Retention cohorts", time: "8m ago" }, { action: "Exported report: Weekly KPIs", time: "1h ago" }, { action: "Created board: Q1 Growth", time: "3h ago" }, { action: "Purchased Pro, $99/mo", time: "2d ago" }, { action: "Signed in via Google SSO", time: "2d ago" }] },
  { id: 1, name: "Jake Miller", email: "jake@acme.co", initials: "JM", color: "bg-zinc-700", lastSeen: "14 min ago", plan: "Free", mrr: 0, sessions: 23, country: "US", signupDate: "Mar 2, 2025",
    activity: [{ action: "Viewed funnel: Onboarding", time: "14m ago" }, { action: "Created event: sign_up", time: "1h ago" }, { action: "Installed SDK: typescript", time: "2h ago" }, { action: "Viewed pricing page", time: "3h ago" }, { action: "Signed up", time: "12d ago" }] },
  { id: 2, name: "Emma Rodriguez", email: "emma@startup.io", initials: "ER", color: "bg-zinc-600", lastSeen: "38 min ago", plan: "Pro", mrr: 99, sessions: 87, country: "ES", signupDate: "Feb 8, 2025",
    activity: [{ action: "Shared board: Revenue dashboard", time: "38m ago" }, { action: "AI query: top converting channels", time: "2h ago" }, { action: "Invite sent to carlos@startup.io", time: "4h ago" }, { action: "Purchased Pro, $99/mo", time: "5d ago" }, { action: "Signed in", time: "5d ago" }] },
  { id: 3, name: "Alex Kim", email: "alex@enterprise.dev", initials: "AK", color: "bg-zinc-700", lastSeen: "1 hr ago", plan: "Enterprise", mrr: 599, sessions: 210, country: "KR", signupDate: "Dec 3, 2024",
    activity: [{ action: "Configured SSO via Okta", time: "1h ago" }, { action: "API key rotated: prod_events", time: "3h ago" }, { action: "Viewed audit log", time: "5h ago" }, { action: "Added 4 team members", time: "1d ago" }, { action: "Upgraded to Enterprise", time: "3d ago" }, { action: "Signed in via Okta", time: "3d ago" }] },
  { id: 4, name: "Maria Santos", email: "maria@design.co", initials: "MS", color: "bg-zinc-600", lastSeen: "2 hr ago", plan: "Free", mrr: 0, sessions: 11, country: "BR", signupDate: "Mar 10, 2025",
    activity: [{ action: "Viewed board: Engagement", time: "2h ago" }, { action: "Signed in", time: "2h ago" }, { action: "Viewed pricing page", time: "3d ago" }, { action: "Signed up", time: "4d ago" }] },
  { id: 5, name: "David Park", email: "david@techstart.com", initials: "DP", color: "bg-zinc-700", lastSeen: "3 hr ago", plan: "Pro", mrr: 99, sessions: 164, country: "US", signupDate: "Jan 22, 2025",
    activity: [{ action: "Created connector: GitHub", time: "3h ago" }, { action: "AI query: deploy frequency vs bugs", time: "5h ago" }, { action: "Viewed lifecycle: resurrected users", time: "1d ago" }, { action: "Purchased Pro, $99/mo", time: "14d ago" }, { action: "Started on Free", time: "28d ago" }] },
  { id: 6, name: "Lisa Wang", email: "lisa@analytics.io", initials: "LW", color: "bg-zinc-600", lastSeen: "5 hr ago", plan: "Pro", mrr: 99, sessions: 93, country: "CA", signupDate: "Feb 1, 2025",
    activity: [{ action: "Exported CSV: cohort data", time: "5h ago" }, { action: "Created segment: Power users", time: "8h ago" }, { action: "Signed in via Google SSO", time: "8h ago" }, { action: "AI query: revenue by country", time: "1d ago" }] },
  { id: 7, name: "Tom Anderson", email: "tom@newco.com", initials: "TA", color: "bg-zinc-700", lastSeen: "1 day ago", plan: "Free", mrr: 0, sessions: 3, country: "GB", signupDate: "Mar 12, 2025",
    activity: [{ action: "Viewed pricing page", time: "1d ago" }, { action: "Installed SDK: react", time: "1d ago" }, { action: "Signed in", time: "1d ago" }, { action: "Signed up", time: "2d ago" }] },
  { id: 8, name: "Priya Sharma", email: "priya@scale.dev", initials: "PS", color: "bg-zinc-600", lastSeen: "6 hr ago", plan: "Pro", mrr: 99, sessions: 118, country: "IN", signupDate: "Jan 5, 2025",
    activity: [{ action: "Configured alerting: anomaly detection", time: "6h ago" }, { action: "Created connector: Cloudflare", time: "1d ago" }, { action: "Signed in", time: "1d ago" }, { action: "Purchased Pro, $99/mo", time: "21d ago" }, { action: "Signed up", time: "69d ago" }] },
  { id: 9, name: "Marcus Johnson", email: "marcus@brand.co", initials: "MJ", color: "bg-zinc-700", lastSeen: "12 hr ago", plan: "Free", mrr: 0, sessions: 18, country: "US", signupDate: "Feb 28, 2025",
    activity: [{ action: "Viewed board: User Funnels", time: "12h ago" }, { action: "AI query: signup sources last 30d", time: "1d ago" }, { action: "Signed in", time: "1d ago" }, { action: "Started on Free", time: "7d ago" }, { action: "Signed up", time: "14d ago" }] },
];

/* ------------------------------------------------------------------ */
/*  Board view — extracted from the original AppShell                  */
/* ------------------------------------------------------------------ */

function BoardContent() {
  const [agentOpen, setAgentOpen] = useState(true);
  const [events, setEvents] = useState([
    { name: "Cart updated", count: 4107, users: "2,034" },
    { name: "Comment posted", count: 1847, users: "892" },
    { name: "Content shared", count: 2891, users: "1,634" },
    { name: "Content viewed", count: 48291, users: "8,412" },
    { name: "Creator followed", count: 1203, users: "634" },
    { name: "Liked", count: 8912, users: "3,247" },
    { name: "Order completed", count: 847, users: "612" },
    { name: "Sign up completed", count: 312, users: "312" },
  ]);
  const [mrr, setMrr] = useState(48200);
  const [stars, setStars] = useState(3847);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setEvents(prev => {
        const next = prev.map(e => ({ ...e }));
        const weights = next.map(e => e.count);
        const total = weights.reduce((a, b) => a + b, 0);
        const rand = Math.random() * total;
        let cum = 0;
        for (let i = 0; i < next.length; i++) {
          cum += weights[i];
          if (rand <= cum) {
            next[i].count += 1;
            break;
          }
        }
        return next;
      });
      timeout = setTimeout(tick, 800 + Math.random() * 1200);
    };
    timeout = setTimeout(tick, 1000 + Math.random() * 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setMrr(prev => prev + [9, 19, 29, 49, 99][Math.floor(Math.random() * 5)]);
      timeout = setTimeout(tick, 3000 + Math.random() * 3000);
    };
    timeout = setTimeout(tick, 2000 + Math.random() * 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setStars(prev => prev + 1);
      timeout = setTimeout(tick, 8000 + Math.random() * 7000);
    };
    timeout = setTimeout(tick, 5000 + Math.random() * 5000);
    return () => clearTimeout(timeout);
  }, []);

  const fmtMrr = (v: number) => `$${(v / 1000).toFixed(1)}K`;

  return (
    <>
      {/* Top bar */}
      <div className="h-[48px] flex items-center justify-between pr-5 shrink-0" style={{ paddingLeft: "32px" }}>
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-[14px]">Growth</span>
          <div className="flex items-center">
            <button onClick={() => setStarred(s => !s)} className={`p-1 rounded-md hover:bg-zinc-800 transition cursor-pointer ${starred ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
            <button className="p-1 rounded-md hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>
        <button className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </div>

      {/* Content area with metrics + floating agent panel */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background metrics */}
        <div className="absolute inset-0 overflow-y-auto p-6 space-y-4">
          {/* Stat cards row \u2014 the four founder questions, answered */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "MRR", value: fmtMrr(mrr), trend: "\u2191 8%", up: true },
              { label: "Trial \u2192 Paid", value: "12.4%", trend: "\u2191 1.2%", up: true },
              { label: "GitHub Stars", value: stars.toLocaleString(), trend: "\u2191 234", up: true },
              { label: "Error rate", value: "0.12%", trend: "\u2193 0.04%", up: true },
            ].map((stat) => (
              <MockStatCard key={stat.label} title={stat.label} value={stat.value} delta={stat.trend} up={stat.up} />
            ))}
          </div>

          {/* Chart + Table row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bar chart */}
            <MockPanelCard title="Active Users" sub="14 days">
              <div className="flex items-end gap-[3px] h-[340px]">
                {[
                  { dau: 42, wau: 68 },
                  { dau: 38, wau: 65 },
                  { dau: 45, wau: 70 },
                  { dau: 40, wau: 66 },
                  { dau: 48, wau: 72 },
                  { dau: 52, wau: 76 },
                  { dau: 44, wau: 71 },
                  { dau: 50, wau: 74 },
                  { dau: 46, wau: 73 },
                  { dau: 55, wau: 78 },
                  { dau: 58, wau: 82 },
                  { dau: 53, wau: 79 },
                  { dau: 60, wau: 85 },
                  { dau: 62, wau: 88 },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]" style={{ height: "100%" }}>
                    <div className="w-full rounded-[1px]" style={{ height: `${bar.wau - bar.dau}%`, backgroundColor: "#a5b4fc", opacity: 0.4 }} />
                    <div className="w-full rounded-[1px]" style={{ height: `${bar.dau}%`, backgroundColor: "#6366f1", opacity: 0.85 }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-zinc-500">
                <span>Feb 28</span><span>Mar 4</span><span>Mar 8</span><span>Mar 13</span>
              </div>
            </MockPanelCard>

            {/* Table */}
            <MockPanelCard title="Top Events" sub="Last 7 days" flush>
              <MockTableGrid
                columns={[
                  { label: "Event", width: "50%" },
                  { label: "Count", align: "right", width: "25%" },
                  { label: "Users", align: "right", width: "25%" },
                ]}
                rows={events.map((row) => [
                  <span key="e" className="text-zinc-300">{row.name}</span>,
                  row.count.toLocaleString(),
                  row.users,
                ])}
              />
            </MockPanelCard>
          </div>
        </div>
        {/* Tell Agent overlay — bottom-right, like Linear Codex */}
        {agentOpen && <div className="absolute bottom-3 right-3 w-[400px] h-[448px] rounded-lg border border-zinc-800/60 bg-[#121314] shadow-2xl hidden md:flex flex-col overflow-hidden z-10">
          {/* Panel header */}
          <div className="h-[44px] flex items-center justify-between px-4 border-b border-zinc-800/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-[22px] h-[22px] rounded-full bg-zinc-700 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300">
                  <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4zM8 14h8a6 6 0 016 6H2a6 6 0 016-6z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-white text-[13px] font-medium">Tell Agent</span>
            </div>
            <button onClick={() => setAgentOpen(false)} className="text-zinc-500 hover:text-zinc-300 transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Panel content — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-[12px] leading-[1.4]">
            <p className="text-zinc-500 font-mono text-[12px]">
              which accounts look like churn risks?
            </p>
            <div className="flex items-center gap-3 text-zinc-500 text-[12px]">
              <span>Worked for 8s</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <p className="text-zinc-400 text-[12px] leading-[1.5]">
              3 accounts show declining usage this week — logins down <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[11px]">60%+</span> and key feature usage stalled. Combined <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[11px]">$1.2K</span> MRR at risk.
            </p>
            <div className="rounded-lg bg-[#111113] border border-zinc-800/60 px-4 py-3 space-y-2 text-[12px]">
              <p className="text-zinc-400"><span className="text-white">2 of 3</span> haven't opened a dashboard in 9 days</p>
              <p className="text-brand">Created board: At-risk accounts</p>
            </div>
          </div>

          {/* Prompt input — Zed-style big field */}
          <div className="border-t border-zinc-800/60 shrink-0">
            <div className="px-4 pt-3 pb-1">
              <span className="text-zinc-500 text-[13px]">Message Tell...</span>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 pb-3">
              <button className="text-zinc-600 hover:text-zinc-400 transition p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <div className="inline-flex items-stretch rounded-lg overflow-hidden bg-brand">
                <button className="flex items-center justify-center px-2.5 py-1.5 text-white hover:bg-brand/80 transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4l18 8-18 8V4z" />
                  </svg>
                </button>
                <div className="w-px bg-white/20" />
                <button className="flex items-center justify-center px-2 py-1.5 text-white hover:bg-brand/80 transition">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Logs view                                                          */
/* ------------------------------------------------------------------ */

function LogsContent() {
  const [logs, setLogs] = useState<LogEntry[]>(seedLogs);
  const [selected, setSelected] = useState<LogEntry>(seedLogs[0]);
  const [paneOpen, setPaneOpen] = useState(true);
  const nextId = useRef(seedLogs.length);
  const nextSec = useRef(9);

  // Animated log streaming — prepend a new entry every 2.5–5s
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = nextSec.current++;
      const min = 4 + Math.floor(s / 60);
      const sec = s % 60;
      const ms = Math.floor(Math.random() * 999);
      const time = `16:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const id = nextId.current++;
      setLogs(prev => [{ id, time, ...template }, ...prev].slice(0, 14));
      timeout = setTimeout(tick, 2500 + Math.random() * 3000);
    };
    timeout = setTimeout(tick, 3000);
    return () => clearTimeout(timeout);
  }, []);
  const jsonLines = detailJson.split("\n");

  return (
    <>
      {/* Top bar */}
      <div className="h-[48px] flex items-center justify-between px-5 shrink-0 border-b border-zinc-800/30">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-white font-medium text-[13px] hover:text-zinc-300 transition cursor-pointer">
              Logs
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-zinc-500">
                <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-[140px] rounded-lg border border-zinc-800/60 bg-[#1a1a1c] shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 py-1">
              {["Events", "Logs", "Sessions", "Users"].map((entity) => (
                <div key={entity} className={`px-3 py-1.5 text-[13px] cursor-pointer transition ${entity === "Logs" ? "text-white bg-white/[0.06]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"}`}>
                  {entity}
                </div>
              ))}
            </div>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800/40 text-zinc-500 text-[13px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span>Search logs...</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-zinc-600" style={{ fontVariantNumeric: "tabular-nums" }}>4,218 logs</span>
          <MockRangePicker />
        </div>
      </div>

      {/* Histogram — 24h volume, single blue like the real explorer */}
      <div className="px-5 pt-3 pb-2 shrink-0 border-b border-zinc-800/30">
        <div className="flex items-end gap-[2px] h-[72px] group/chart">
          {logHistogram.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end cursor-crosshair opacity-85 hover:opacity-100 transition-opacity" style={{ height: "100%" }}>
              <div
                className="w-full rounded-t-[2px]"
                style={{ height: `${Math.min(96, bar.debug + bar.info + bar.warn + bar.err)}%`, backgroundColor: "hsl(220 70% 60%)" }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] text-zinc-600">
          <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span>
        </div>
      </div>

      {/* Table + Detail side pane */}
      <div className="flex-1 flex min-h-0">
        {/* Log table */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-2 text-[13px] text-zinc-400 border-b border-zinc-800/30 shrink-0">
            <span className="w-1.5 shrink-0" />
            <span className="w-[132px] shrink-0">Time</span>
            <span className="w-[52px] shrink-0">Source</span>
            <span className="w-[56px] shrink-0">Level</span>
            <span className="flex-1">Message</span>
          </div>
          {/* Table rows */}
          <div className="flex-1 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => { setSelected(log); setPaneOpen(true); }}
                className={`flex gap-4 px-5 py-2.5 text-[13px] text-zinc-500 cursor-pointer transition-colors border-b border-zinc-800/15 ${
                  paneOpen && selected.id === log.id ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                <span className={`w-1.5 h-1.5 mt-[7px] rounded-full shrink-0 ${
                  log.level === "ERROR" ? "bg-[#ef4444]" : log.level === "WARN" ? "bg-[#d97706]" : log.level === "INFO" ? "bg-[#22a3bf]" : "bg-zinc-600"
                }`} />
                <span className="w-[132px] shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {log.time}
                </span>
                <span className="w-[52px] shrink-0">{log.source}</span>
                <span className={`w-[56px] shrink-0 ${
                  log.level === "ERROR" ? "text-[#ef4444]" : log.level === "WARN" ? "text-[#d97706]" : log.level === "INFO" ? "text-[#22a3bf]" : "text-zinc-500"
                }`}>
                  {log.level}
                </span>
                <div className="flex-1 min-w-0 leading-[1.55]">
                  <span className="flex flex-wrap items-start gap-1">
                    {log.tags.map((tag) => (
                      <span key={tag} className="inline-block bg-zinc-800/80 text-zinc-300 px-1.5 py-[1px] rounded text-[11px] whitespace-nowrap shrink-0">{tag}</span>
                    ))}
                    <span className="break-all">{log.body}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Status bar */}
          <div className="shrink-0 px-5 py-1.5 border-t border-zinc-800/30 text-[13px] text-zinc-600">
            Showing 1–{logs.length} of 4,218 logs
          </div>
        </div>

        {/* Detail pane — closeable */}
        {paneOpen && (
          <div className="w-[340px] shrink-0 border-l border-zinc-800/30 hidden md:flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-[36px] flex items-center justify-between px-5 border-b border-zinc-800/30 shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-zinc-300 text-[13px]">Overview</span>
                <span className="text-zinc-500 text-[13px] cursor-pointer hover:text-zinc-400 transition">Explain with AI</span>
              </div>
              <button onClick={() => setPaneOpen(false)} className="text-zinc-600 hover:text-zinc-400 transition cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Key-value details */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 pt-4 pb-4 border-b border-zinc-800/30">
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Timestamp</span>
                    <span className="text-zinc-300">{selected.time} ET</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Level</span>
                    <span className={`${
                      selected.level === "ERROR" ? "text-[#ef4444]" : selected.level === "WARN" ? "text-[#d97706]" : selected.level === "INFO" ? "text-[#22a3bf]" : "text-zinc-500"
                    }`}>{selected.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Source</span>
                    <span className="text-zinc-300">{selected.source}</span>
                  </div>
                </div>
              </div>

              {/* JSON content */}
              <div className="px-5 py-3">
                <div className="text-[11px] leading-[1.7] font-mono">
                  {jsonLines.map((line, i) => (
                    <div key={i} className="flex hover:bg-white/[0.02] rounded-sm">
                      <span className="text-zinc-700 select-none w-5 shrink-0 text-right mr-3">{i + 1}</span>
                      <span className="text-zinc-400 whitespace-pre">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Metrics view — OTel/infra board, mirrors tell-web MetricCard style */
/* ------------------------------------------------------------------ */

const cpuSeries = [38, 41, 39, 44, 42, 47, 45, 43, 46, 49, 44, 41, 43, 40, 43, 42];
const p95Series = [96, 102, 98, 110, 105, 118, 142, 126, 112, 108, 115, 111, 106, 112, 109, 118];

const metricStats = [
  { title: "API latency (p95)", value: "118 ms", delta: "↓ 6 ms", up: true },
  { title: "Error rate", value: "0.12%", delta: "↓ 0.04%", up: true },
  { title: "CPU · prod-01", value: "42.3%", delta: "↑ 2.1%", up: false },
  { title: "Requests · Today", value: "1.2M", delta: "↑ 8%", up: true },
];

const serviceRows = [
  { svc: "api", p95: "96 ms", err: "0.08%", req: "620K" },
  { svc: "checkout", p95: "118 ms", err: "0.21%", req: "84K" },
  { svc: "auth", p95: "44 ms", err: "0.03%", req: "210K" },
  { svc: "worker", p95: "31 ms", err: "0.02%", req: "132K" },
  { svc: "ingest", p95: "12 ms", err: "0.00%", req: "188K" },
];

// Shared range picker — the same hover-dropdown control the Logs view uses,
// so the Metrics board and Logs read as one interface.
function MockRangePicker() {
  return (
    <div className="relative group/time flex items-center">
      <button className="relative flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer">
        Last 24 hours
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-zinc-600">
          <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
      </button>
      <div className="absolute top-full right-0 mt-1 w-[140px] rounded-lg border border-zinc-800/60 bg-[#1a1a1c] shadow-xl opacity-0 pointer-events-none group-hover/time:opacity-100 group-hover/time:pointer-events-auto transition-opacity z-20 py-1">
        {["Last 1 hour", "Last 6 hours", "Last 24 hours", "Last 7 days", "Last 30 days"].map((t) => (
          <div key={t} className={`px-3 py-1.5 text-[13px] cursor-pointer transition ${t === "Last 24 hours" ? "text-white bg-white/[0.06]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"}`}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsContent() {
  return (
    <>
      {/* Board-style header */}
      <MockToolbar
        title="Health"
        right={<MockRangePicker />}
      />

      {/* Card grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-4 content-start">
        {metricStats.map((m) => (
          <MockStatCard key={m.title} title={m.title} value={m.value} delta={m.delta} up={m.up} />
        ))}

        <MockPanelCard
          className="col-span-2 min-h-[240px]"
          title="Checkout latency (p95)"
          sub="/api/checkout"
        >
          <MockLine data={p95Series} unit="ms" yTop="160 ms" yMid="80 ms" />
        </MockPanelCard>
        <MockPanelCard
          className="col-span-2 min-h-[240px]"
          title="CPU · prod-01"
        >
          <MockLine data={cpuSeries} unit="%" yTop="60%" yMid="30%" />
        </MockPanelCard>

        <MockPanelCard className="col-span-2 md:col-span-4" title="By service" sub="last 24h" flush>
          <MockTableGrid
            columns={[
              { label: "Service" },
              { label: "p95", align: "right", width: 96 },
              { label: "Errors", align: "right", width: 96 },
              { label: "Requests", align: "right", width: 110 },
            ]}
            rows={serviceRows.map((r) => [
              <span key="s" className="text-zinc-300">{r.svc}</span>,
              r.p95,
              <span key="err" className={r.err === "0.21%" ? "text-[#d97706]" : undefined}>{r.err}</span>,
              r.req,
            ])}
          />
        </MockPanelCard>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric Trees view — growth model canvas                            */
/* ------------------------------------------------------------------ */

type TreeNode = {
  id: string;
  label: string;
  value: string;
  delta: string;
  up: boolean | null;
  x: number;
  y: number;
  spark: number[];
  computed?: boolean;
  // Prior-period ghost line under the sparkline.
  prior?: number[];
  // KPI target status + pacing bar (KpiBadge parity).
  status?: MockStatus;
  progress?: number;
  // Multi-compare footer row (MoM/YoY/WoW) — replaces the single delta chip.
  compares?: MockCompare[];
  // Owner initials chip (governance hint).
  owner?: string;
};

// Node chrome + edges mirror the real canvas: NodeCard (rounded-xl border
// bg-card p-3, 2xl semibold value, arrow delta chip, brand area sparkline
// with prior-period ghost, target status + pacing, multi-compare chips)
// connected by dotted driver edges carrying correlation pills.
const treeNodes: TreeNode[] = [
  {
    id: "mrr", label: "MRR", value: "$48.2K", delta: "8%", up: true, x: 50, y: 3,
    spark: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 48.2],
    prior: [35, 35.4, 36, 36.5, 37, 37.6, 38, 38.6, 39.2, 40, 40.8, 41.5],
    computed: true, owner: "Jimmi A", status: "on_track", progress: 0.82,
    compares: [
      { kind: "MoM", delta: "8%", up: true },
      { kind: "YoY", delta: "34%", up: true },
    ],
  },
  {
    id: "new", label: "New MRR", value: "$6.1K", delta: "14%", up: true, x: 19, y: 38,
    spark: [4.2, 4.4, 4.3, 4.8, 5.0, 4.9, 5.3, 5.6, 5.8, 6.1],
    prior: [3.9, 4.0, 4.0, 4.2, 4.3, 4.3, 4.5, 4.6, 4.8, 4.9],
    compares: [
      { kind: "WoW", delta: "5%", up: true },
      { kind: "MoM", delta: "14%", up: true },
      { kind: "YoY", delta: "61%", up: true },
    ],
  },
  { id: "exp", label: "Expansion", value: "$2.4K", delta: "6%", up: true, x: 50, y: 38, spark: [1.9, 2.0, 2.1, 2.0, 2.2, 2.1, 2.3, 2.3, 2.4, 2.4] },
  {
    id: "churn", label: "Churned", value: "-$1.8K", delta: "0.3%", up: false, x: 81, y: 38,
    spark: [1.4, 1.5, 1.4, 1.6, 1.5, 1.7, 1.6, 1.7, 1.8, 1.8],
    status: "at_risk",
  },
  {
    id: "signups", label: "Signups", value: "1,982", delta: "12%", up: true, x: 9, y: 73,
    spark: [1420, 1480, 1510, 1560, 1620, 1680, 1710, 1790, 1880, 1982],
    prior: [1310, 1350, 1380, 1410, 1450, 1500, 1540, 1600, 1660, 1720],
  },
  { id: "conv", label: "Trial → Paid", value: "12.4%", delta: "1.2%", up: true, x: 31, y: 73, spark: [10.8, 11.0, 11.1, 11.4, 11.2, 11.6, 11.9, 12.1, 12.2, 12.4], computed: true },
  { id: "arpu", label: "ARPU", value: "$99", delta: "0%", up: null, x: 53, y: 73, spark: [99, 99, 98, 99, 99, 100, 99, 99, 99, 99], computed: true },
  {
    id: "atrisk", label: "At-risk accounts", value: "3", delta: "$1.2K", up: false, x: 81, y: 73,
    spark: [1, 1, 2, 1, 2, 2, 3, 2, 3, 3],
    status: "at_risk",
  },
];

type TreeEdge = {
  from: string; // parent
  to: string; // child (driver flows child → parent)
  driver?: boolean;
  corr?: string;
  strength?: MockCorrStrength;
};

// Additive edges (MRR = New + Expansion − Churned) stay muted; driver edges
// carry a computed correlation pill, like the real canvas.
const treeEdges: TreeEdge[] = [
  { from: "mrr", to: "new" },
  { from: "mrr", to: "exp" },
  { from: "mrr", to: "churn" },
  { from: "new", to: "signups", driver: true, corr: "+0.8", strength: "strong" },
  { from: "new", to: "conv", driver: true, corr: "+0.6", strength: "moderate" },
  { from: "exp", to: "arpu", driver: true, corr: "+0.3", strength: "moderate" },
  { from: "churn", to: "atrisk", driver: true, corr: "+0.2", strength: "weak" },
];

// Approximate node height as a % of the canvas so edges leave the top center
// of the child and land on the bottom center of the parent (child → parent).
const TREE_NODE_H_PCT = 22;

function TreesContent() {
  const byId = (id: string) => treeNodes.find((n) => n.id === id)!;
  return (
    <>
      <MockToolbar title="Growth model" right={<span>Last 30 days</span>} />
      <div
        className="relative flex-1 min-h-0 m-4 rounded-lg overflow-hidden"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      >
        {/* Edges — dotted directional connectors (child → parent); driver
            edges accented, mirroring the real canvas renderer */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <marker id="tree-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L6,3 L0,6 Z" fill="#8b5cf6" fillOpacity="0.85" />
            </marker>
            <marker id="tree-arrow-muted" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L6,3 L0,6 Z" fill="#71717a" fillOpacity="0.6" />
            </marker>
          </defs>
          {treeEdges.map((e) => {
            const parent = byId(e.from);
            const child = byId(e.to);
            // Draw child(top) → parent(bottom) so the arrow points up into the parent.
            const x1 = child.x;
            const y1 = child.y;
            const x2 = parent.x;
            const y2 = parent.y + TREE_NODE_H_PCT;
            return (
              <path
                key={`${e.from}-${e.to}`}
                d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                fill="none"
                stroke={e.driver ? "#8b5cf6" : "#71717a"}
                strokeOpacity={e.driver ? 0.7 : 0.45}
                strokeWidth="1.5"
                strokeDasharray="1 4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                markerEnd={e.driver ? "url(#tree-arrow)" : "url(#tree-arrow-muted)"}
              />
            );
          })}
        </svg>
        {/* Correlation pills — along driver edges, closer to the child
            (t=0.4) so pills converging on one parent don't collide */}
        {treeEdges
          .filter((e) => e.corr)
          .map((e) => {
            const parent = byId(e.from);
            const child = byId(e.to);
            const t = 0.4;
            const px = child.x + (parent.x - child.x) * t;
            const py = child.y + (parent.y + TREE_NODE_H_PCT - child.y) * t;
            return (
              <div
                key={`corr-${e.from}-${e.to}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${px}%`, top: `${py}%` }}
              >
                <MockCorrelationPill coefficient={e.corr!} strength={e.strength!} />
              </div>
            );
          })}
        {/* Nodes */}
        {treeNodes.map((n) => (
          <MockNodeCard
            key={n.id}
            className="absolute -translate-x-1/2 w-[190px]"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            title={n.label}
            value={n.value}
            delta={n.delta}
            up={n.up}
            spark={n.spark}
            prior={n.prior}
            sparkId={`tree-${n.id}`}
            computed={n.computed}
            status={n.status}
            progress={n.progress}
            compares={n.compares}
            owner={n.owner}
          />
        ))}
        {/* Insight annotation — a node logbook entry pinned near New MRR */}
        <div className="absolute w-[180px] rounded-lg border border-zinc-800 bg-[#141416]/95 p-2.5 shadow-lg" style={{ left: "1.5%", top: "60%" }}>
          <p className="text-[11px] leading-snug text-zinc-300">
            Uptick driven by the Q2 launch campaign.
          </p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[9.5px] text-zinc-600">Jimmi A · Jul 24</span>
            <span className="text-[9.5px] font-medium text-brand">See analysis →</span>
          </div>
        </div>
        <div className="absolute bottom-3 left-4 max-w-[62%] text-[11px] leading-snug text-zinc-500">
          Every node is a live metric. Edges show how each driver correlates — with targets, pacing, and alerts built in.
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Snapshots view — connector pulls                                   */
/* ------------------------------------------------------------------ */

// Board cards over snapshot metrics — plain MetricCards, identical chrome to
// the Board tab's stat row.
const snapshotCards = [
  { svc: "github", metric: "stars", value: "3,847", delta: "↑ 235", pulled: "12m ago" },
  { svc: "youtube", metric: "subscribers", value: "12.1K", delta: "↑ 4%", pulled: "12m ago" },
  { svc: "stripe", metric: "mrr", value: "$48.2K", delta: "↑ 8%", pulled: "8m ago" },
  { svc: "shopify", metric: "orders_today", value: "214", delta: "↑ 11%", pulled: "5m ago" },
];

// The real Snapshots surface is the data explorer's snapshots bucket — a
// table of Time · Service · Entity · Metrics, where Metrics is the pulled
// key/value gauge set for that entity.
const snapshotRows = [
  { time: "16:02:11", service: "stripe", entity: "acme-prod", metrics: [["mrr", "48,214"], ["active_subs", "487"], ["currency", "usd"]] },
  { time: "16:02:08", service: "github", entity: "tell-rs/tell", metrics: [["stars", "3,847"], ["forks", "214"], ["open_issues", "23"]] },
  { time: "16:01:54", service: "youtube", entity: "@tell", metrics: [["subscribers", "12,104"], ["views_48h", "8,241"]] },
  { time: "16:01:41", service: "shopify", entity: "acme.myshopify.com", metrics: [["orders_today", "214"], ["aov", "49.20"]] },
  { time: "16:01:41", service: "meta_ads", entity: "launch-q3", metrics: [["roas", "3.2"], ["spend_today", "412.90"]] },
  { time: "16:01:12", service: "app_store", entity: "com.acme.app", metrics: [["downloads", "342"], ["rating", "4.8"]] },
];

// Snapshot card title — clean, human-readable ("Shopify orders today",
// "Stripe MRR"): service capitalized, metric de-underscored, acronyms upper.
const SNAP_ACRONYMS = new Set(["mrr", "arr", "arpu", "mau", "dau", "wau", "ltv", "roas", "aov", "nps"]);
function snapLabel(svc: string, metric: string): string {
  const service = svc.charAt(0).toUpperCase() + svc.slice(1);
  const words = metric
    .split(/[_\-.]/)
    .map((w) => (SNAP_ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w));
  return `${service} ${words.join(" ")}`;
}

function SnapshotsContent() {
  return (
    <>
      <MockToolbar title="Snapshots" right={<span>5 connectors · hourly</span>} />
      {/* Board cards over snapshot metrics — same chrome as every other card */}
      <div className="p-6 pb-0 grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {snapshotCards.map((c) => (
          <MockStatCard
            key={c.svc}
            title={snapLabel(c.svc, c.metric)}
            value={c.value}
            delta={c.delta}
            up
          />
        ))}
      </div>
      {/* The explorer table is the surface — recent pulls, full width */}
      <div className="flex-1 min-h-0 flex flex-col mt-4">
        <div className="px-5 py-2 border-t border-zinc-800/30 shrink-0">
          <p className="text-zinc-400 text-[12px] leading-[17px] font-medium">
            Recent pulls · chart any of these next to signups or retention
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MockTableGrid
            columns={[
              { label: "Time", width: 110 },
              { label: "Service", width: "1%" },
              { label: "Entity", width: "1%" },
              { label: "Metrics" },
            ]}
            rows={snapshotRows.map((r) => [
              r.time,
              r.service,
              r.entity,
              <span key="m" className="truncate block">
                {r.metrics.map(([k, v], i) => (
                  <Fragment key={k}>
                    {i > 0 && ", "}
                    <span className="text-zinc-500">{k}</span>
                    {": "}
                    <span className="text-zinc-300">{v}</span>
                  </Fragment>
                ))}
              </span>,
            ])}
          />
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Users view                                                         */
/* ------------------------------------------------------------------ */

function UsersContent() {
  const [selectedId, setSelectedId] = useState(0);
  const [paneOpen, setPaneOpen] = useState(true);
  const selected = seedUsers.find(u => u.id === selectedId) ?? seedUsers[0];

  return (
    <>
      {/* Top bar */}
      <div className="h-[48px] flex items-center justify-between px-5 shrink-0 border-b border-zinc-800/30">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-white font-medium text-[13px] hover:text-zinc-300 transition cursor-pointer">
              Users
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-zinc-500">
                <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-[140px] rounded-lg border border-zinc-800/60 bg-[#1a1a1c] shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 py-1">
              {["Events", "Logs", "Sessions", "Users"].map((entity) => (
                <div key={entity} className={`px-3 py-1.5 text-[13px] cursor-pointer transition ${entity === "Users" ? "text-white bg-white/[0.06]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"}`}>
                  {entity}
                </div>
              ))}
            </div>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800/40 text-zinc-500 text-[13px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span>Search users...</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group/time">
            <button className="flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer">
              Last 30 days
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-zinc-600">
                <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-1 w-[140px] rounded-lg border border-zinc-800/60 bg-[#1a1a1c] shadow-xl opacity-0 pointer-events-none group-hover/time:opacity-100 group-hover/time:pointer-events-auto transition-opacity z-20 py-1">
              {["Last 7 days", "Last 30 days", "Last 90 days"].map((t) => (
                <div key={t} className={`px-3 py-1.5 text-[13px] cursor-pointer transition ${t === "Last 30 days" ? "text-white bg-white/[0.06]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"}`}>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <span className="text-[13px] text-zinc-600">{seedUsers.length} users</span>
        </div>
      </div>

      {/* Table + Detail split */}
      <div className="flex-1 flex min-h-0">
        {/* User table */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_68px_68px_60px_44px] gap-2 px-5 py-2 text-[13px] text-zinc-400 border-b border-zinc-800/30 shrink-0">
            <span>User</span>
            <span>Last seen</span>
            <span>Plan</span>
            <span className="text-right">MRR</span>
            <span className="text-right">Sessions</span>
            <span className="text-right">Country</span>
          </div>
          {/* Table rows */}
          <div className="flex-1 overflow-y-auto">
            {seedUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => { setSelectedId(user.id); setPaneOpen(true); }}
                className={`grid grid-cols-[1fr_120px_68px_68px_60px_44px] gap-2 px-5 py-2.5 text-[13px] text-zinc-500 cursor-pointer transition-colors border-b border-zinc-800/15 items-center ${
                  paneOpen && user.id === selectedId ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-[26px] h-[26px] rounded-full ${user.color} flex items-center justify-center text-[10px] text-zinc-300 shrink-0`}>
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-zinc-300 truncate leading-tight">{user.name}</p>
                    <p className="text-zinc-600 truncate leading-tight">{user.email}</p>
                  </div>
                </div>
                <span>{user.lastSeen}</span>
                <span>{user.plan}</span>
                <span className="text-right" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {user.mrr > 0 ? `$${user.mrr}` : "–"}
                </span>
                <span className="text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{user.sessions}</span>
                <span className="text-right">{user.country}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail pane */}
        {paneOpen && <div className="w-[340px] shrink-0 border-l border-zinc-800/30 hidden md:flex flex-col overflow-hidden">
          {/* Detail header bar — aligns with table header */}
          <div className="h-[36px] flex items-center justify-between px-5 border-b border-zinc-800/30 shrink-0">
            <span className="text-[13px] text-zinc-400">Profile</span>
            <button onClick={() => setPaneOpen(false)} className="text-zinc-600 hover:text-zinc-400 transition cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          {/* User identity */}
          <div className="px-5 pt-4 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${selected.color} flex items-center justify-center text-[12px] text-zinc-300 shrink-0`}>
                {selected.initials}
              </div>
              <div>
                <p className="text-zinc-300 text-[13px] font-medium leading-tight">{selected.name}</p>
                <p className="text-zinc-600 text-[13px] leading-tight">{selected.email}</p>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="px-5 pb-4 border-b border-zinc-800/30 shrink-0">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-3">Properties</p>
            <div className="space-y-2.5 text-[13px]">
              {[
                { label: "Plan", value: selected.plan },
                { label: "MRR", value: selected.mrr > 0 ? `$${selected.mrr}/mo` : "–" },
                { label: "Sessions", value: String(selected.sessions) },
                { label: "Signup", value: selected.signupDate },
                { label: "Last seen", value: selected.lastSeen },
                { label: "Country", value: selected.country },
              ].map((prop) => (
                <div key={prop.label} className="flex items-center justify-between">
                  <span className="text-zinc-500">{prop.label}</span>
                  <span className="text-zinc-300">{prop.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-3">Recent activity</p>
            <div className="space-y-0.5">
              {selected.activity.map((event, i) => (
                <div key={i} className="rounded-md px-2 py-1.5 -mx-2 hover:bg-white/[0.03] transition-colors cursor-default">
                  <p className="text-zinc-300 text-[13px] leading-snug">{event.action}</p>
                  <p className="text-zinc-600 text-[13px]">{event.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Ask view — full-screen AI prompt                                   */
/* ------------------------------------------------------------------ */

function AskContent() {
  return (
    <div className="flex flex-col h-full">
      {/* Conversation area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[640px] mx-auto space-y-6">
          {/* User prompt */}
          <p className="text-zinc-500 text-[13px] font-mono">
            How is my business doing since last Monday? Include GitHub stars in the analysis.
          </p>

          {/* Separator */}
          <div className="flex items-center gap-3 text-zinc-600 text-[13px]">
            <span>Worked for 12s</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* AI response */}
          <div className="space-y-4 text-[13px] text-zinc-400 leading-relaxed">
            <p>
              Since last Monday (Mar 10), MRR grew <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[12px]">+$2.4K</span> to $48.3K — driven by 6 new Pro subscriptions and 1 Enterprise upgrade (Alex Kim). Free-to-paid conversion is at <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[12px]">12.4%</span>, up from 11.1% the week before.
            </p>

            {/* Inline chart block — revenue + stars */}
            <div className="rounded-lg border border-zinc-800/40 bg-[#111113] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 text-[12px]">MRR + GitHub Stars · Last 7 days</span>
              </div>
              <div className="flex items-end gap-[3px] h-[120px]">
                {[
                  { mrr: 45800, stars: 3612 },
                  { mrr: 46100, stars: 3641 },
                  { mrr: 46100, stars: 3658 },
                  { mrr: 46800, stars: 3694 },
                  { mrr: 47200, stars: 3721 },
                  { mrr: 47900, stars: 3782 },
                  { mrr: 48300, stars: 3847 },
                ].map((d, i) => {
                  const mrrH = ((d.mrr - 45000) / 4000) * 70;
                  const starsH = ((d.stars - 3500) / 400) * 45;
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-[2px]" style={{ height: "100%" }}>
                      <div className="w-full rounded-t-[2px]" style={{ height: `${starsH}%`, backgroundColor: "#52525b", opacity: 0.5 }} />
                      <div className="w-full rounded-b-[1px]" style={{ height: `${mrrH}%`, backgroundColor: "#818cf8" }} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-zinc-600">
                <span>Mar 10</span><span>Mar 11</span><span>Mar 12</span><span>Mar 13</span><span>Mar 14</span><span>Mar 15</span><span>Today</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#818cf8" }} />MRR</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#52525b" }} />GitHub Stars</span>
              </div>
            </div>

            <p>
              GitHub stars added <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[12px]">+235</span> this week (3,612 → 3,847), a <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[12px]">2.8x</span> increase over the prior week's +84. The spike correlates with a Hacker News front-page post on Tuesday — 62% of new signups this week came from that referrer.
            </p>

            <p>
              Churn risk is low: 0 downgrades, 0 cancellations. The 3 free-tier users who signed up this week (Tom, Maria, Marcus) have all been active in the last 24 hours — above-average engagement for day-3 cohort.
            </p>

            {/* Action card */}
            <div className="rounded-lg bg-[#111113] border border-zinc-800/60 px-4 py-3 space-y-2 text-[13px]">
              <p className="text-zinc-400"><span className="text-zinc-300">6</span> new paying customers this week</p>
              <p className="text-zinc-400"><span className="text-zinc-300">$2,396</span> net new ARR</p>
              <p className="text-brand">Created board: Weekly Growth Summary</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt input — bottom */}
      <div className="border-t border-zinc-800/60 shrink-0 px-8">
        <div className="max-w-[640px] mx-auto">
          <div className="px-0 pt-3 pb-1">
            <span className="text-zinc-500 text-[13px]">Message Tell...</span>
          </div>
          <div className="flex items-center justify-end gap-2 pb-3">
            <button className="text-zinc-600 hover:text-zinc-400 transition p-1 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Events view                                                        */
/* ------------------------------------------------------------------ */

type EventEntry = {
  id: number;
  time: string;
  event: string;
  user: string | null;
  props: { key: string; value: string }[];
};

const seedEvents: EventEntry[] = [
  { id: 0, time: "16:04:08.912", event: "Page viewed", user: "Sarah Chen",
    props: [{ key: "path", value: "/dashboard" }, { key: "referrer", value: "/login" }, { key: "duration", value: "4.2s" }, { key: "source", value: "web-sdk" }, { key: "session_id", value: "ses_a83cd496" }] },
  { id: 1, time: "16:04:07.341", event: "Order completed", user: "Emma Rodriguez",
    props: [{ key: "order_id", value: "ord_8f2a" }, { key: "total", value: "$149.00" }, { key: "items", value: "3" }, { key: "currency", value: "USD" }, { key: "source", value: "web-sdk" }] },
  { id: 2, time: "16:04:06.118", event: "Sign up completed", user: null,
    props: [{ key: "method", value: "google_sso" }, { key: "plan", value: "free" }, { key: "source", value: "hacker_news" }, { key: "device", value: "iPhone" }, { key: "os", value: "ios 18.2" }] },
  { id: 3, time: "16:04:05.442", event: "Feature used", user: "David Park",
    props: [{ key: "feature", value: "ai_query" }, { key: "query", value: "churn by cohort" }, { key: "latency", value: "1.2s" }, { key: "source", value: "web-sdk" }] },
  { id: 4, time: "16:04:04.891", event: "Cart updated", user: null,
    props: [{ key: "action", value: "add" }, { key: "item", value: "pro_plan" }, { key: "value", value: "$99" }, { key: "source", value: "web-sdk" }, { key: "locale", value: "en_US" }] },
  { id: 5, time: "16:04:03.227", event: "Page viewed", user: "Jake Miller",
    props: [{ key: "path", value: "/pricing" }, { key: "referrer", value: "/features" }, { key: "duration", value: "12.8s" }, { key: "source", value: "web-sdk" }] },
  { id: 6, time: "16:04:02.661", event: "Invite sent", user: "Alex Kim",
    props: [{ key: "to", value: "dev@enterprise.dev" }, { key: "role", value: "admin" }, { key: "org", value: "enterprise_dev" }, { key: "source", value: "web-sdk" }] },
  { id: 7, time: "16:04:01.993", event: "Content shared", user: "Priya Sharma",
    props: [{ key: "type", value: "board" }, { key: "id", value: "brd_retention" }, { key: "channel", value: "slack" }, { key: "recipients", value: "4" }] },
  { id: 8, time: "16:04:00.874", event: "Page viewed", user: null,
    props: [{ key: "path", value: "/features" }, { key: "referrer", value: "google.com" }, { key: "duration", value: "8.4s" }, { key: "device", value: "Android" }, { key: "source", value: "web-sdk" }] },
  { id: 9, time: "16:03:59.112", event: "Plan upgraded", user: "Marcus Johnson",
    props: [{ key: "from", value: "free" }, { key: "to", value: "pro" }, { key: "mrr", value: "$99" }, { key: "ai_queries_today", value: "7" }] },
  { id: 10, time: "16:03:58.443", event: "Feature used", user: "Sarah Chen",
    props: [{ key: "feature", value: "export_csv" }, { key: "rows", value: "14,280" }, { key: "format", value: "csv" }, { key: "duration", value: "3.1s" }] },
  { id: 11, time: "16:03:57.221", event: "Connector created", user: "David Park",
    props: [{ key: "type", value: "github" }, { key: "repo", value: "techstart/api" }, { key: "sync", value: "hourly" }] },
];

// Events histogram — same 24h/15min pattern, single color (no severity)
const eventHistogram = (() => {
  let s = 77;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
  const bars: number[] = [];
  for (let i = 0; i < 96; i++) {
    const hour = i / 4;
    const dayFactor = hour >= 6 && hour <= 20 ? 0.5 + 0.5 * Math.sin((hour - 6) / 14 * Math.PI) : 0.1 + rand() * 0.1;
    bars.push(Math.round(15 + dayFactor * 75 + rand() * 12));
  }
  return bars;
})();

function EventsContent() {
  const [selected, setSelected] = useState<EventEntry>(seedEvents[0]);
  const [paneOpen, setPaneOpen] = useState(true);

  return (
    <>
      {/* Top bar */}
      <div className="h-[48px] flex items-center justify-between px-5 shrink-0 border-b border-zinc-800/30">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-white font-medium text-[13px] hover:text-zinc-300 transition cursor-pointer">
              Events
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-zinc-500">
                <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-[140px] rounded-lg border border-zinc-800/60 bg-[#1a1a1c] shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 py-1">
              {["Events", "Logs", "Sessions", "Users"].map((entity) => (
                <div key={entity} className={`px-3 py-1.5 text-[13px] cursor-pointer transition ${entity === "Events" ? "text-white bg-white/[0.06]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"}`}>
                  {entity}
                </div>
              ))}
            </div>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800/40 text-zinc-500 text-[13px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span>Search events...</span>
          </div>
        </div>
        <div className="relative group/time">
          <button className="flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer">
            Last 24 hours
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-zinc-600">
              <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="absolute top-full right-0 mt-1 w-[140px] rounded-lg border border-zinc-800/60 bg-[#1a1a1c] shadow-xl opacity-0 pointer-events-none group-hover/time:opacity-100 group-hover/time:pointer-events-auto transition-opacity z-20 py-1">
            {["Last 1 hour", "Last 6 hours", "Last 24 hours", "Last 7 days", "Last 30 days"].map((t) => (
              <div key={t} className={`px-3 py-1.5 text-[13px] cursor-pointer transition ${t === "Last 24 hours" ? "text-white bg-white/[0.06]" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"}`}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Histogram — 24h, 15-min intervals, single color */}
      <div className="px-5 pt-3 pb-2 shrink-0 border-b border-zinc-800/30">
        <div className="flex items-end gap-[2px] h-[72px]">
          {eventHistogram.map((vol, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end cursor-crosshair opacity-85 hover:opacity-100 transition-opacity" style={{ height: "100%" }}>
              <div className="w-full rounded-t-[2px]" style={{ height: `${vol}%`, backgroundColor: "#818cf8" }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] text-zinc-600">
          <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span>
        </div>
      </div>

      {/* Table + Detail pane */}
      <div className="flex-1 flex min-h-0">
        {/* Event table */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-2 text-[13px] text-zinc-400 border-b border-zinc-800/30 shrink-0">
            <span className="w-[140px] shrink-0">Time</span>
            <span className="w-[140px] shrink-0">Event</span>
            <span className="w-[140px] shrink-0">User</span>
            <span className="flex-1">Properties</span>
          </div>
          {/* Table rows */}
          <div className="flex-1 overflow-y-auto">
            {seedEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => { setSelected(ev); setPaneOpen(true); }}
                className={`flex gap-4 px-5 py-2.5 text-[13px] text-zinc-500 cursor-pointer transition-colors border-b border-zinc-800/15 ${
                  paneOpen && selected.id === ev.id ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                <span className="w-[140px] shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>{ev.time}</span>
                <span className="w-[140px] shrink-0 text-zinc-300">{ev.event}</span>
                <span className="w-[140px] shrink-0 truncate">{ev.user ?? "Anonymous"}</span>
                <span className="flex-1 truncate text-zinc-600">{ev.props.map(p => `${p.key}: ${p.value}`).join(", ")}</span>
              </div>
            ))}
          </div>
          {/* Status bar */}
          <div className="shrink-0 px-5 py-1.5 border-t border-zinc-800/30 text-[13px] text-zinc-600">
            Showing 1–{seedEvents.length} of 12,847 events
          </div>
        </div>

        {/* Detail pane — closeable */}
        {paneOpen && (
          <div className="w-[340px] shrink-0 border-l border-zinc-800/30 hidden md:flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-[36px] flex items-center justify-between px-5 border-b border-zinc-800/30 shrink-0">
              <span className="text-[13px] text-zinc-400">Event detail</span>
              <button onClick={() => setPaneOpen(false)} className="text-zinc-600 hover:text-zinc-400 transition cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Scrollable detail content */}
            <div className="flex-1 overflow-y-auto">
              {/* Event identity */}
              <div className="px-5 pt-4 pb-4 border-b border-zinc-800/30">
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Event</span>
                    <span className="text-zinc-300">{selected.event}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Timestamp</span>
                    <span className="text-zinc-300">{selected.time} ET</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">User</span>
                    <span className="text-zinc-300">{selected.user ?? "Anonymous"}</span>
                  </div>
                </div>
              </div>

              {/* Properties */}
              <div className="px-5 py-4 border-b border-zinc-800/30">
                <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-3">Properties</p>
                <div className="space-y-2.5 text-[13px]">
                  {selected.props.map((prop) => (
                    <div key={prop.key} className="flex items-center justify-between">
                      <span className="text-zinc-500">{prop.key}</span>
                      <span className="text-zinc-300">{prop.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Product analytics view — funnel + channel breakdown                */
/* ------------------------------------------------------------------ */

const shellFunnelSteps = [
  { name: "Visited site", count: "48,201", pct: 100, conv: null },
  { name: "Signed up", count: "12,847", pct: 26.7, conv: "26.7%" },
  { name: "Created project", count: "8,412", pct: 17.4, conv: "65.5%" },
  { name: "Activated", count: "6,034", pct: 12.5, conv: "71.7%" },
  { name: "Upgraded to paid", count: "1,982", pct: 4.1, conv: "32.8%" },
];

const funnelChannels = [
  { name: "Hacker News", signups: "4,102", conv: "6.8%", pct: 100 },
  { name: "Organic search", signups: "3,418", conv: "3.9%", pct: 57 },
  { name: "GitHub readme", signups: "2,634", conv: "5.1%", pct: 75 },
  { name: "YouTube", signups: "1,481", conv: "2.7%", pct: 40 },
  { name: "Paid ads", signups: "1,212", conv: "3.2%", pct: 47 },
];

function AnalyticsContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="h-[48px] flex items-center justify-between pr-5 shrink-0" style={{ paddingLeft: "32px" }}>
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-[14px]">Acquisition</span>
        </div>
        <span className="text-[13px] text-zinc-500">Last 30 days</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 content-stretch">
        {/* Funnel card */}
        <MockPanelCard title="Onboarding funnel" sub="All users" className="min-h-0">
        <div className="flex-1 min-w-0 flex flex-col pt-2">
          <div className="flex-1 flex flex-col justify-between gap-3">
            {shellFunnelSteps.map((step, i) => (
              <div key={step.name}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-zinc-300 text-[13px]">{step.name}</span>
                  <span className="text-[12px] font-mono text-zinc-500" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {step.count}
                    {step.conv && <span className="text-zinc-600"> · {step.conv}</span>}
                  </span>
                </div>
                <div className="h-[26px] rounded-[4px] bg-zinc-800/30 overflow-hidden">
                  <div
                    className="h-full rounded-[4px]"
                    style={{
                      width: mounted ? `${step.pct}%` : "0%",
                      minWidth: mounted ? 14 : 0,
                      background: `linear-gradient(90deg, rgba(100,90,230,${0.95 - i * 0.12}), rgba(100,90,230,${0.55 - i * 0.07}))`,
                      transition: `width 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 110}ms, min-width 1.1s ${i * 110}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-zinc-600 text-[12px] mt-4 shrink-0">
            Overall conversion <span className="text-zinc-400">4.1%</span> · median time to convert <span className="text-zinc-400">2d 4h</span>
          </p>
        </div>

        {/* Channel breakdown */}
        </MockPanelCard>
        <MockPanelCard title="Signups by channel" sub="visit → paid" flush className="hidden md:flex min-h-0">
        <div className="flex flex-col overflow-hidden flex-1">
          <div className="hidden items-center justify-between px-5 shrink-0">
            <span className="text-[13px] text-zinc-400">Signups by channel</span>
            <span className="text-[12px] text-zinc-600 font-mono">visit → paid</span>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {funnelChannels.map((ch, i) => (
              <div
                key={ch.name}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "none" : "translateY(8px)",
                  transition: `opacity 0.5s ease ${200 + i * 100}ms, transform 0.5s ease ${200 + i * 100}ms`,
                }}
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-zinc-300 text-[13px]">{ch.name}</span>
                  <span className="text-[12px] font-mono text-zinc-500" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {ch.signups} <span className="text-zinc-600">· {ch.conv}</span>
                  </span>
                </div>
                <div className="h-[8px] rounded-[2px] bg-zinc-800/40 overflow-hidden">
                  <div
                    className="h-full rounded-[2px] bg-brand/70"
                    style={{
                      width: mounted ? `${ch.pct}%` : "0%",
                      transition: `width 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
            <p className="text-zinc-600 text-[12px] leading-relaxed pt-2">
              HN visitors convert <span className="text-zinc-400">1.7x</span> better than organic — worth another launch post.
            </p>
          </div>
        </div>
        </MockPanelCard>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  App shell — tab bar + sidebar view switcher                        */
/* ------------------------------------------------------------------ */

type ShellView = "board" | "analytics" | "logs" | "metrics" | "trees" | "snapshots" | "users" | "events" | "ask";

const shellTabs: { label: string; view: ShellView; icon: string }[] = [
  { label: "Board", view: "board", icon: "M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z" },
  { label: "Product", view: "analytics", icon: "M18 20V10M12 20V4M6 20v-6" },
  { label: "Logs", view: "logs", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { label: "Metrics", view: "metrics", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { label: "Metric Trees", view: "trees", icon: "M12 3v6M12 9l-6 4M12 9l6 4M6 13v5M18 13v5" },
  { label: "Snapshots", view: "snapshots", icon: "M4 7h3l2-3h6l2 3h3v13H4V7zM12 17a4 4 0 100-8 4 4 0 000 8z" },
  { label: "Ask AI", view: "ask", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
];

function AppShell() {
  const [view, setView] = useState<ShellView>("board");

  return (
    <div className="relative w-full rounded-2xl bg-[#090a0b] p-3 text-[13px]">
      {/* Tab bar — pick a view, it stays put */}
      <div className="flex items-center gap-1 px-1 pb-3 overflow-x-auto" role="tablist" aria-label="Product views">
        {shellTabs.map((tab) => {
          const active = view === tab.view;
          return (
            <button
              key={tab.view}
              role="tab"
              aria-selected={active}
              onClick={() => setView(tab.view)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                active ? "bg-zinc-800/80 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={active ? "opacity-100" : "opacity-60"}>
                <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="w-full h-[540px] md:h-[720px] rounded-xl bg-[#111113] overflow-hidden flex">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 p-2">
        {/* Inset content panel */}
        <BorderGlow className="flex-1">
        <div className="h-full rounded-lg border border-zinc-800/40 bg-[#121314] flex flex-col overflow-hidden">
          <div key={view} className="view-fade flex-1 min-h-0 flex flex-col">
            {view === "board" && <BoardContent />}
            {view === "analytics" && <AnalyticsContent />}
            {view === "ask" && <AskContent />}
            {view === "events" && <EventsContent />}
            {view === "logs" && <LogsContent />}
            {view === "metrics" && <MetricsContent />}
            {view === "trees" && <TreesContent />}
            {view === "snapshots" && <SnapshotsContent />}
            {view === "users" && <UsersContent />}
          </div>
        </div>
        </BorderGlow>
      </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky section rail — visible while scrolling the pillar sections  */
/* ------------------------------------------------------------------ */

const railSections = [
  { id: "product-analytics", label: "Product Analytics" },
  { id: "logs", label: "Logs & Metrics" },
  { id: "marketing-data", label: "Marketing Data" },
];

function SectionRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const current = railSections.find((s) => visible.has(s.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    for (const s of railSections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!active}
      className={`hidden min-[1600px]:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-3.5 transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {railSections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`/#${s.id}`}
            className={`flex items-center gap-2.5 text-[12px] transition-colors ${
              isActive ? "text-foreground" : "text-faint hover:text-muted"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive ? "bg-brand" : "bg-track"}`} />
            {s.label}
          </a>
        );
      })}
    </div>
  );
}

function Home() {
  // The route is code-split, so on a direct visit to /#section the anchor
  // doesn't exist when the browser tries to scroll — retry after hydration.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const t = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero + Mockup with dot grid */}
      <div className="relative overflow-hidden">
        <DotGrid focusPoints={[[0.95, 0.05], [0.05, 0.85]]} />
        {/* Hero */}
        <section className="pt-[140px] pb-6 px-6 relative">
          <div className="max-w-[1340px] mx-auto md:px-8">
            <div className="flex items-start justify-between">
              <div className="max-w-[860px]">
                <h1 className="hero-enter text-[48px] md:text-[76px] leading-[1.05] font-semibold tracking-[-0.035em] text-foreground">
                  Analytics that tell the whole story.
                </h1>
                <p className="hero-enter hero-enter-1 mt-6 max-w-[720px] text-[17px] leading-[1.6] text-muted">
                  Product analytics, logs and errors, revenue, and your marketing
                  channels — GitHub, YouTube, Stripe, ads — side by side in one
                  self-hostable Rust binary.
                </p>
                <div className="hero-enter hero-enter-2 mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-[#746cf0] transition shadow-[0_0_32px_rgba(100,90,230,0.35)]"
                  >
                    Get started free
                  </Link>
                  <a
                    href="https://docs.tell.rs"
                    className="px-5 py-2.5 text-sm font-medium text-strong border border-border rounded-lg hover:border-faint hover:text-foreground transition"
                  >
                    Read the docs
                  </a>
                </div>
                <div className="hero-enter hero-enter-3 mt-7">
                  <InstallBlock />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero UI Mockup — full container width */}
        <section className="px-6 pb-20 relative">
          <div className="hero-enter hero-enter-4 max-w-[1340px] mx-auto">
            <AppShell />
          </div>
          <p className="mt-6 text-center text-[15px] text-muted">
            One Rust binary · 64M events/sec · Self-host free forever — or Tell Cloud
          </p>
        </section>
      </div>


      {/* Sources — what data comes in and how */}
      <SourcesSection />

      {/* Sticky rail for the three pillar sections (wide desktop only) */}
      <SectionRail />

      {/* Section 1: Is the product growing? — product analytics */}
      <section id="product-analytics" className="px-6 scroll-mt-16" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <Reveal className="md:px-8 mb-14">
            <span className="text-brand text-[12px] font-mono font-medium tracking-[0.14em]">IS THE PRODUCT GROWING?</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-5">
              <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
                Understand the full user journey
              </h2>
              <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
                See how users move through your product — where they convert,
                what keeps them engaged, and where you lose them.
              </p>
            </div>
          </Reveal>
          {/* Sub-sections */}
          <div className="md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-14">
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">01</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Convert more users</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">02</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Drive engagement</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">03</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Retain and grow</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">04</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Predict churn</h3>
            </div>
          </div>
          {/* Mockup — full width: funnel + retention cohorts */}
          <Reveal delay={120}>
            <FunnelMock />
          </Reveal>
        </div>
      </section>

      {/* Section 2: Is the app healthy? — logs & metrics */}
      <section id="logs" className="px-6 scroll-mt-16" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <Reveal className="md:px-8 mb-14">
            <span className="text-brand text-[12px] font-mono font-medium tracking-[0.14em]">IS THE APP HEALTHY?</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-5">
              <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
                See what your systems are telling you
              </h2>
              <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
                Structured logs and infrastructure metrics in the same store as
                your product events — so "errors spiked" and "signups dropped"
                are one query, not two tools.
              </p>
            </div>
          </Reveal>
          {/* Sub-sections */}
          <div className="md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-14">
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">01</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Catch issues early</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">02</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Debug faster</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">03</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Monitor every service</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">04</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Stay compliant automatically</h3>
            </div>
          </div>
          {/* Mockup — full width: live tail + infra metrics */}
          <Reveal delay={120}>
            <LogsMock />
          </Reveal>
        </div>
      </section>

      {/* Section 3: Are the channels working? Is revenue growing? — marketing data */}
      <section id="marketing-data" className="px-6 scroll-mt-16" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <Reveal className="md:px-8 mb-14">
            <span className="text-brand text-[12px] font-mono font-medium tracking-[0.14em]">ARE THE CHANNELS WORKING? IS REVENUE GROWING?</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-5">
              <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
                Your growth channels, charted next to your product
              </h2>
              <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
                GitHub stars, YouTube subscribers, ad performance, and Stripe
                revenue land in the same store as your product events — one
                chart away from signups and retention.
              </p>
            </div>
          </Reveal>
          {/* Mockup — full width: multi-series growth chart */}
          <Reveal delay={120}>
            <MarketingMock />
          </Reveal>
          {/* Connector cards — the section's second half */}
          <ConnectorsGrid />
        </div>
      </section>

      {/* Section 4: Ask anything. Tell answers. — AI / MCP / CLI */}
      <section id="ai" className="px-6 scroll-mt-16" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <Reveal className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Ask anything.
              <br />
              Tell answers.
            </h2>
            <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              60+ MCP tools. Works with Claude, Cursor, or any AI agent you build.
              Raw SQL via ClickHouse, live tail from the CLI, interactive TUI mode.
              Ask your data questions in natural language.
            </p>
          </Reveal>
          {/* Mockup — full width: AI terminal + agent surfaces */}
          <Reveal delay={120}>
            <TerminalMock />
          </Reveal>
        </div>
      </section>

      {/* Section 5: Audiences & ML — define your audiences */}
      <section id="audiences" className="px-6 scroll-mt-16" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <Reveal className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Define your
              <br />
              audiences with precision
            </h2>
            <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              Named audiences with behavioral rules, property filters, and ML
              predictions. "Users likely to churn this week" or "power users
              who haven't purchased." Cross-device identity resolution at query
              time.
            </p>
          </Reveal>
          {/* Mockup — full width: audience rule builder + identity resolution */}
          <Reveal delay={120}>
            <AudienceMock />
          </Reveal>
        </div>
      </section>

      {/* Collaboration — share the whole story */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <Reveal className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Share the whole story
            </h2>
            <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              Product, engineering, and marketing — aligned around the same data, without bottlenecks.
            </p>
          </Reveal>
          {/* Sub-sections */}
          <div className="md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-14">
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">01</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Share insights with a link</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">02</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Align on the metrics that matter</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">03</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Control access by role</h3>
            </div>
            <div>
              <span className="feature-num text-faint text-[13px] font-mono">04</span>
              <h3 className="text-foreground font-medium text-[15px] mt-1">Investor updates in real time</h3>
            </div>
          </div>
          {/* Mockup — full width: shared live board with cursors + access roles */}
          <Reveal delay={120}>
            <ShareMock />
          </Reveal>
        </div>
      </section>

      {/* Section 7: Unreasonably fast — full-bleed brand band */}
      <section
        id="performance"
        className="px-6 scroll-mt-16 border-y border-border/40"
        style={{
          paddingTop: 96,
          paddingBottom: 128,
          background: "linear-gradient(180deg, rgba(100,90,230,0.07) 0%, rgba(100,90,230,0.02) 45%, transparent 100%)",
        }}
      >
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <Reveal className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Unreasonably fast.
            </h2>
            <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              Rust from the ground up. Every component benchmarked, every number reproducible.
            </p>
          </Reveal>
          {/* Big benchmark numbers */}
          <div className="md:px-8 grid grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-14">
            {[
              { k: "Pipeline", v: "64M", u: "events/sec ingestion" },
              { k: "Routing", v: "750ps", u: "per batch decision" },
              { k: "Transforms", v: "10.9M", u: "events/sec PII redaction in-flight" },
              { k: "Storage", v: "33M", u: "events/sec to disk, 2.6M/sec to Parquet" },
              { k: "SDK", v: "80ns", u: "per event — 1,000x faster than PostHog" },
              { k: "Agent", v: "1.2MB", u: "binary — 76ns per log, 30ns per metric" },
            ].map((stat, i) => (
              <Reveal key={stat.k} delay={i * 80}>
                <span className="text-faint text-[13px] font-mono">{stat.k}</span>
                <p
                  className="text-foreground text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.03em] mt-2"
                  style={{ fontWeight: 510, fontVariantNumeric: "tabular-nums" }}
                >
                  {stat.v}
                </p>
                <p className="text-muted-foreground text-[15px] leading-snug mt-2 max-w-[260px]">{stat.u}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Self-host + enterprise */}
      <section id="self-host" className="px-6 scroll-mt-16" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          <Reveal className="md:px-8 mb-12">
            <span className="text-brand text-[12px] font-mono font-medium tracking-[0.14em]">RUN IT YOURSELF</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-5">
              <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
                Self-host in five minutes. Actually supported.
              </h2>
              <p className="text-muted text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
                One binary. Free forever for anyone — no license key, no
                account, no credit card. Licenses for paid tiers verify
                offline; air-gapped installs are first-class.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Changelog */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto md:px-8">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground mb-16" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
            Changelog
          </h2>

          {/* Timeline + cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
            {getAllEntries().slice(0, 4).map((entry, i) => (
              <Link to="/changelog/$slug" params={{ slug: entry.slug }} key={entry.slug} className="group block">
                {/* Timeline dot + line */}
                <div className="flex items-center mb-8">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? "bg-brand" : "bg-faint"}`} />
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="pr-2">
                  <h3 className="text-foreground text-[15px] font-medium mb-2 leading-snug group-hover:text-brand transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-strong text-[14px] leading-[1.5] mb-4 line-clamp-4 transition-colors">
                    {entry.summary}
                  </p>
                  <p className="text-muted group-hover:text-strong text-[12px] font-mono tracking-wide uppercase transition-colors">
                    {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(",", ",")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/changelog" className="inline-flex items-center gap-1.5 mt-12 text-[14px] text-muted-foreground hover:text-foreground transition-colors">
            See all releases <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Footer CTA — text inset */}
      <section className="py-32 md:py-44 px-6 relative overflow-hidden">
        <DotGrid focusPoints={[[0.95, 0.9], [0.05, 0.9]]} />
        <div className="max-w-[1340px] mx-auto text-center relative">
          <h2 className="text-[42px] md:text-[58px] font-semibold tracking-[-0.035em] text-foreground leading-[1.08] mb-10">
            Built for clarity.
            <br />
            Available today.
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-contrast text-contrast-fg text-sm font-medium rounded-lg hover:bg-contrast-hover transition"
            >
              Get Started
            </Link>
            <a
              href="mailto:hello@tell.rs"
              className="px-5 py-2.5 text-sm font-medium text-muted border border-border rounded-lg hover:border-faint hover:text-strong transition"
            >
              Contact
            </a>
          </div>
          <p className="mt-5 text-[13px] text-muted-foreground">
            Free forever tier · Self-host in 5 minutes · No credit card
          </p>
          <div className="mt-8 flex justify-center">
            <InstallBlock />
          </div>
        </div>
      </section>
    </div>
  );
}

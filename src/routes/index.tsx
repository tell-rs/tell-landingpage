import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { getAllEntries } from "../content/changelog";
import { ConnectorsSection } from "../components/connectors-section";
import { DotGrid } from "../components/dot-grid";

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
        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition cursor-pointer shrink-0"
        title="Copy install command"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <span className="text-[13px] font-mono font-semibold">$</span>
        )}
      </button>
      <code className="text-[15px] font-mono text-zinc-500">{command}</code>
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
  { id: 0, name: "Sarah Chen", email: "sarah@bigcorp.com", initials: "SC", color: "bg-zinc-600", lastSeen: "2 min ago", plan: "Pro", mrr: 299, sessions: 142, country: "US", signupDate: "Jan 14, 2025",
    activity: [{ action: "AI query: weekly churn breakdown", time: "2m ago" }, { action: "Viewed board: Retention cohorts", time: "8m ago" }, { action: "Exported report: Weekly KPIs", time: "1h ago" }, { action: "Created board: Q1 Growth", time: "3h ago" }, { action: "Purchased Pro, $299/mo", time: "2d ago" }, { action: "Signed in via Google SSO", time: "2d ago" }] },
  { id: 1, name: "Jake Miller", email: "jake@acme.co", initials: "JM", color: "bg-zinc-700", lastSeen: "14 min ago", plan: "Free", mrr: 0, sessions: 23, country: "US", signupDate: "Mar 2, 2025",
    activity: [{ action: "Viewed funnel: Onboarding", time: "14m ago" }, { action: "Created event: sign_up", time: "1h ago" }, { action: "Installed SDK: typescript", time: "2h ago" }, { action: "Viewed pricing page", time: "3h ago" }, { action: "Signed up", time: "12d ago" }] },
  { id: 2, name: "Emma Rodriguez", email: "emma@startup.io", initials: "ER", color: "bg-zinc-600", lastSeen: "38 min ago", plan: "Pro", mrr: 149, sessions: 87, country: "ES", signupDate: "Feb 8, 2025",
    activity: [{ action: "Shared board: Revenue dashboard", time: "38m ago" }, { action: "AI query: top converting channels", time: "2h ago" }, { action: "Invite sent to carlos@startup.io", time: "4h ago" }, { action: "Purchased Pro, $149/mo", time: "5d ago" }, { action: "Signed in", time: "5d ago" }] },
  { id: 3, name: "Alex Kim", email: "alex@enterprise.dev", initials: "AK", color: "bg-zinc-700", lastSeen: "1 hr ago", plan: "Enterprise", mrr: 599, sessions: 210, country: "KR", signupDate: "Dec 3, 2024",
    activity: [{ action: "Configured SSO via Okta", time: "1h ago" }, { action: "API key rotated: prod_events", time: "3h ago" }, { action: "Viewed audit log", time: "5h ago" }, { action: "Added 4 team members", time: "1d ago" }, { action: "Upgraded to Enterprise, $599/mo", time: "3d ago" }, { action: "Signed in via Okta", time: "3d ago" }] },
  { id: 4, name: "Maria Santos", email: "maria@design.co", initials: "MS", color: "bg-zinc-600", lastSeen: "2 hr ago", plan: "Free", mrr: 0, sessions: 11, country: "BR", signupDate: "Mar 10, 2025",
    activity: [{ action: "Viewed board: Engagement", time: "2h ago" }, { action: "Signed in", time: "2h ago" }, { action: "Viewed pricing page", time: "3d ago" }, { action: "Signed up", time: "4d ago" }] },
  { id: 5, name: "David Park", email: "david@techstart.com", initials: "DP", color: "bg-zinc-700", lastSeen: "3 hr ago", plan: "Pro", mrr: 299, sessions: 164, country: "US", signupDate: "Jan 22, 2025",
    activity: [{ action: "Created connector: GitHub", time: "3h ago" }, { action: "AI query: deploy frequency vs bugs", time: "5h ago" }, { action: "Viewed lifecycle: resurrected users", time: "1d ago" }, { action: "Purchased Pro, $299/mo", time: "14d ago" }, { action: "Started free trial", time: "28d ago" }] },
  { id: 6, name: "Lisa Wang", email: "lisa@analytics.io", initials: "LW", color: "bg-zinc-600", lastSeen: "5 hr ago", plan: "Pro", mrr: 149, sessions: 93, country: "CA", signupDate: "Feb 1, 2025",
    activity: [{ action: "Exported CSV: cohort data", time: "5h ago" }, { action: "Created segment: Power users", time: "8h ago" }, { action: "Signed in via Google SSO", time: "8h ago" }, { action: "AI query: revenue by country", time: "1d ago" }] },
  { id: 7, name: "Tom Anderson", email: "tom@newco.com", initials: "TA", color: "bg-zinc-700", lastSeen: "1 day ago", plan: "Free", mrr: 0, sessions: 3, country: "GB", signupDate: "Mar 12, 2025",
    activity: [{ action: "Viewed pricing page", time: "1d ago" }, { action: "Installed SDK: react", time: "1d ago" }, { action: "Signed in", time: "1d ago" }, { action: "Signed up", time: "2d ago" }] },
  { id: 8, name: "Priya Sharma", email: "priya@scale.dev", initials: "PS", color: "bg-zinc-600", lastSeen: "6 hr ago", plan: "Pro", mrr: 299, sessions: 118, country: "IN", signupDate: "Jan 5, 2025",
    activity: [{ action: "Configured alerting: anomaly detection", time: "6h ago" }, { action: "Created connector: Cloudflare", time: "1d ago" }, { action: "Signed in", time: "1d ago" }, { action: "Purchased Pro, $299/mo", time: "21d ago" }, { action: "Signed up", time: "69d ago" }] },
  { id: 9, name: "Marcus Johnson", email: "marcus@brand.co", initials: "MJ", color: "bg-zinc-700", lastSeen: "12 hr ago", plan: "Free", mrr: 0, sessions: 18, country: "US", signupDate: "Feb 28, 2025",
    activity: [{ action: "Viewed board: User Funnels", time: "12h ago" }, { action: "AI query: signup sources last 30d", time: "1d ago" }, { action: "Signed in", time: "1d ago" }, { action: "Started free trial", time: "7d ago" }, { action: "Signed up", time: "14d ago" }] },
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
          {/* Stat cards row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "MRR", value: fmtMrr(mrr), trend: "\u2191 8%", up: true },
              { label: "Trial \u2192 Paid", value: "12.4%", trend: "\u2191 1.2%", up: true },
              { label: "GitHub Stars", value: stars.toLocaleString(), trend: "\u2191 234", up: true },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-800/40" style={{ padding: "20px 24px 22px" }}>
                <p className="text-zinc-400 text-[12px] leading-[17px] font-medium mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-white text-[32px] leading-[36px] tracking-[-0.022em]" style={{ fontWeight: 510, fontVariantNumeric: "tabular-nums slashed-zero" }}>{stat.value}</p>
                  <span className={`text-[13px] font-medium ${stat.up ? "text-emerald-400" : "text-red-400"}`}>{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Table row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Bar chart */}
            <div className="rounded-xl border border-zinc-800/40" style={{ padding: "20px 24px 22px" }}>
              <p className="text-zinc-400 text-[12px] font-medium mb-4">Active Users · 14 days</p>
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
              <div className="flex justify-between mt-2 text-[9px] text-zinc-400">
                <span>Feb 28</span><span>Mar 4</span><span>Mar 8</span><span>Mar 13</span>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-800/40" style={{ padding: "20px 0 22px" }}>
              <p className="text-zinc-400 text-[12px] font-medium mb-4 px-6">Top Events · Last 7 days</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-zinc-400 text-[12px] leading-[17px] border-t border-b border-zinc-800/30">
                    <th className="text-left font-normal py-2 pl-6" style={{ width: "50%" }}>Event</th>
                    <th className="text-right font-normal py-2" style={{ width: "25%" }}>Count</th>
                    <th className="text-right font-normal py-2 pr-6" style={{ width: "25%" }}>Users</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] leading-[20px]">
                  {events.map((row) => (
                    <tr key={row.name} className="border-b border-zinc-800/30" style={{ height: "40px" }}>
                      <td className="text-zinc-300 pl-6">{row.name}</td>
                      <td className="text-right text-zinc-400" style={{ fontVariantNumeric: "tabular-nums" }}>{row.count.toLocaleString()}</td>
                      <td className="text-right text-zinc-400 pr-6" style={{ fontVariantNumeric: "tabular-nums" }}>{row.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Tell Agent overlay — bottom-right, like Linear Codex */}
        {agentOpen && <div className="absolute bottom-3 right-3 w-[400px] h-[448px] rounded-lg border border-zinc-800/60 bg-[#121314] shadow-2xl flex flex-col overflow-hidden z-10">
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
              what's driving the signup spike this week?
            </p>
            <div className="flex items-center gap-3 text-zinc-500 text-[12px]">
              <span>Worked for 8s</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <p className="text-zinc-400 text-[12px] leading-[1.5]">
              62% of new signups came from a <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[11px]">Hacker News</span> post on Monday. These users have <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[11px]">2.1x</span> higher activation rate than organic.
            </p>
            <div className="rounded-lg bg-[#111113] border border-zinc-800/60 px-4 py-3 space-y-2 text-[12px]">
              <p className="text-zinc-400"><span className="text-white">34</span> already converted to paid</p>
              <p className="text-brand">Created board: HN signup cohort analysis</p>
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
              <button className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
              </button>
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

      {/* Histogram — 24h, 15-min intervals */}
      <div className="px-5 pt-3 pb-2 shrink-0 border-b border-zinc-800/30">
        <div className="flex items-end gap-[2px] h-[72px] group/chart">
          {logHistogram.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end cursor-crosshair opacity-85 hover:opacity-100 transition-opacity" style={{ height: "100%" }}>
              <div className="w-full rounded-t-[2px]" style={{ height: `${bar.debug}%`, backgroundColor: "#52525b", opacity: 0.4 }} />
              <div className="w-full" style={{ height: `${bar.info}%`, backgroundColor: "#818cf8" }} />
              {bar.warn > 0 && (
                <div className="w-full" style={{ height: `${bar.warn}%`, backgroundColor: "#fca5a5" }} />
              )}
              {bar.err > 0 && (
                <div className="w-full" style={{ height: `${bar.err}%`, backgroundColor: "#f87171" }} />
              )}
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
            <span className="w-[140px] shrink-0">Time</span>
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
                <span className="w-[140px] shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {log.time}
                </span>
                <span className="w-[52px] shrink-0">{log.source}</span>
                <span className={`w-[56px] shrink-0 ${
                  log.level === "ERROR" ? "text-red-400" : log.level === "WARN" ? "text-red-300" : log.level === "INFO" ? "text-[#818cf8]" : "text-zinc-500"
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
          <div className="w-[340px] shrink-0 border-l border-zinc-800/30 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-[36px] flex items-center justify-between px-5 border-b border-zinc-800/30 shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-zinc-300 text-[13px] border-b border-zinc-300" style={{ paddingBottom: 6, marginBottom: -1 }}>Overview</span>
                <span className="text-zinc-500 text-[13px] cursor-pointer hover:text-zinc-400 transition">Explain with AI</span>
              </div>
              <button onClick={() => setPaneOpen(false)} className="text-zinc-600 hover:text-zinc-400 transition cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Timestamp + level */}
            <div className="px-5 py-3 border-b border-zinc-800/30 shrink-0 flex items-center justify-between">
              <span className="text-zinc-300 text-[13px]">{selected.time} ET</span>
              <span className={`text-[13px] ${
                selected.level === "ERROR" ? "text-red-400" : selected.level === "WARN" ? "text-red-300" : selected.level === "INFO" ? "text-[#818cf8]" : "text-zinc-500"
              }`}>{selected.level}</span>
            </div>

            {/* JSON content */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
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
        )}
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
        {paneOpen && <div className="w-[340px] shrink-0 border-l border-zinc-800/30 flex flex-col overflow-hidden">
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
              Since last Monday (Mar 10), MRR grew <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[12px]">+$2.4K</span> to $48.3K — driven by 6 new Pro subscriptions and 1 Enterprise upgrade (Alex Kim, $599/mo). Trial-to-paid conversion is at <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[12px]">12.4%</span>, up from 11.1% the week before.
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
    props: [{ key: "action", value: "add" }, { key: "item", value: "pro_plan" }, { key: "value", value: "$299" }, { key: "source", value: "web-sdk" }, { key: "locale", value: "en_US" }] },
  { id: 5, time: "16:04:03.227", event: "Page viewed", user: "Jake Miller",
    props: [{ key: "path", value: "/pricing" }, { key: "referrer", value: "/features" }, { key: "duration", value: "12.8s" }, { key: "source", value: "web-sdk" }] },
  { id: 6, time: "16:04:02.661", event: "Invite sent", user: "Alex Kim",
    props: [{ key: "to", value: "dev@enterprise.dev" }, { key: "role", value: "admin" }, { key: "org", value: "enterprise_dev" }, { key: "source", value: "web-sdk" }] },
  { id: 7, time: "16:04:01.993", event: "Content shared", user: "Priya Sharma",
    props: [{ key: "type", value: "board" }, { key: "id", value: "brd_retention" }, { key: "channel", value: "slack" }, { key: "recipients", value: "4" }] },
  { id: 8, time: "16:04:00.874", event: "Page viewed", user: null,
    props: [{ key: "path", value: "/features" }, { key: "referrer", value: "google.com" }, { key: "duration", value: "8.4s" }, { key: "device", value: "Android" }, { key: "source", value: "web-sdk" }] },
  { id: 9, time: "16:03:59.112", event: "Plan upgraded", user: "Marcus Johnson",
    props: [{ key: "from", value: "free" }, { key: "to", value: "pro" }, { key: "mrr", value: "$149" }, { key: "trial_days_used", value: "7" }] },
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
          <div className="w-[340px] shrink-0 border-l border-zinc-800/30 flex flex-col overflow-hidden">
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
/*  App shell — sidebar + view switcher                                */
/* ------------------------------------------------------------------ */

function AppShell() {
  const [view, setView] = useState<"board" | "logs" | "users" | "events" | "ask">("board");

  const navItems = [
    { label: "Ask", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", target: "ask" as const },
    { label: "Events", icon: "M13 10V3L4 14h7v7l9-11h-7z", target: "events" as const },
    { label: "Logs", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", target: "logs" as const },
    { label: "Users", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", target: "users" as const },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#090a0b] p-3 text-[13px]">
      <div className="w-full h-[720px] rounded-xl bg-[#111113] overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[232px] shrink-0 flex flex-col" style={{ padding: "8px 14px 8px 8px" }}>
        {/* Brand + switcher */}
        <div className="px-2.5 h-[48px] flex items-center mb-3">
          <button className="flex items-center gap-2.5 text-white font-semibold text-[14px] hover:text-zinc-300 transition">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
              <path d="M5 6h10M5 10h7M5 14h4" stroke="#a1a1aa" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Tell
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-zinc-500">
              <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const active = item.target === view;
              return (
                <button
                  key={item.label}
                  onClick={() => setView(item.target)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-md transition text-left cursor-pointer ${
                    active ? "bg-zinc-800/60 text-white" : "hover:bg-zinc-800/60"
                  }`}
                  style={active ? undefined : { color: "rgb(208, 214, 224)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`shrink-0 ${active ? "opacity-100" : "opacity-60"}`}>
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Boards section */}
          <div className="mt-5">
            <div className="px-2.5 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "rgb(98, 102, 109)" }}>Boards</span>
            </div>
            <nav className="space-y-0.5">
              {["User Funnels", "Revenue", "Engagement"].map((label) => (
                <button
                  key={label}
                  onClick={() => setView("board")}
                  className="w-full px-2.5 py-[6px] rounded-md hover:bg-zinc-800/60 transition text-left cursor-pointer"
                  style={{ color: "rgb(208, 214, 224)" }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Favorites section */}
          <div className="mt-5">
            <div className="px-2.5 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "rgb(98, 102, 109)" }}>Favorites</span>
            </div>
            <nav className="space-y-0.5">
              {["Churn prediction", "Weekly KPIs", "Onboarding flow", "Retention cohorts"].map((label) => (
                <button
                  key={label}
                  onClick={() => setView("board")}
                  className="w-full px-2.5 py-[6px] rounded-md hover:bg-zinc-800/60 transition text-left cursor-pointer"
                  style={{ color: "rgb(208, 214, 224)" }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 p-2">
        {/* Inset content panel */}
        <BorderGlow className="flex-1">
        <div className="h-full rounded-lg border border-zinc-800/40 bg-[#121314] flex flex-col overflow-hidden">
          {view === "board" && <BoardContent />}
          {view === "ask" && <AskContent />}
          {view === "events" && <EventsContent />}
          {view === "logs" && <LogsContent />}
          {view === "users" && <UsersContent />}
        </div>
        </BorderGlow>
      </div>
      </div>
    </div>
  );
}

function Home() {
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
                <h1 className="text-[48px] md:text-[76px] leading-[1.05] font-semibold tracking-[-0.035em] text-white">
                  Analytics that tell the whole story
                </h1>
                <p className="mt-6 text-[17px] leading-[1.6] text-zinc-400 max-w-[540px]">
                  Product analytics, structured logs, and business signals — 64M events/sec. Rust.
                </p>
                <div className="mt-8">
                  <InstallBlock />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero UI Mockup — full container width */}
        <section className="px-6 pb-20 relative">
          <div className="max-w-[1340px] mx-auto">
            <AppShell />
          </div>
        </section>
      </div>


      {/* Feature Intro — text inset */}
      <section className="py-28 md:py-36 px-6">
        <div className="max-w-[1340px] mx-auto md:px-8">
          <p className="text-[48px] leading-[1] tracking-[-0.022em]" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
            <span className="text-white">
              A new species of analytics tool.
            </span>{" "}
            <span className="text-zinc-500">
              Built on a real-time pipeline with ML enrichment and WASM plugins
              at its core, Tell sets a new standard for understanding users and
              shipping products.
            </span>
          </p>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="w-12 h-12 mb-5 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" className="text-zinc-500">
                  <path d="M10 28L6 24V16l4-4h8l4 4v8l-4 4H10z" strokeWidth="1.2"/>
                  <path d="M22 28l-4-4V16l4-4h8l4 4v8l-4 4H22z" strokeWidth="1.2" strokeOpacity="0.4"/>
                  <path d="M16 22l-4-4V10l4-4h8l4 4v8l-4 4H16z" strokeWidth="1.2" strokeOpacity="0.6"/>
                </svg>
              </div>
              <h3 className="text-white font-medium text-[15px] mb-2">Funnels & retention</h3>
              <p className="text-zinc-500 text-[14px] leading-relaxed">
                Conversion funnels with per-step filters, cohort retention
                matrices, lifecycle analysis, and DAU/MAU stickiness ratios.
                Built-in segments for new, returning, and churned users.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mb-5 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" className="text-zinc-500">
                  <ellipse cx="20" cy="10" rx="12" ry="4" strokeWidth="1.2"/>
                  <path d="M8 10v20c0 2.2 5.4 4 12 4s12-1.8 12-4V10" strokeWidth="1.2"/>
                  <path d="M8 20c0 2.2 5.4 4 12 4s12-1.8 12-4" strokeWidth="1.2" strokeOpacity="0.5"/>
                </svg>
              </div>
              <h3 className="text-white font-medium text-[15px] mb-2">Structured logging</h3>
              <p className="text-zinc-500 text-[14px] leading-relaxed">
                9 severity levels, source and service metadata, ML anomaly
                detection, and PII redaction with 11 built-in patterns. Live
                tail from the CLI.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mb-5 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" className="text-zinc-500">
                  <path d="M20 4L36 14v12L20 36 4 26V14L20 4z" strokeWidth="1.2"/>
                  <path d="M20 4v32" strokeWidth="1.2" strokeOpacity="0.3"/>
                  <path d="M4 14l16 6 16-6" strokeWidth="1.2" strokeOpacity="0.3"/>
                  <path d="M4 26l16-6 16 6" strokeWidth="1.2" strokeOpacity="0.3"/>
                </svg>
              </div>
              <h3 className="text-white font-medium text-[15px] mb-2">Real-time pipeline</h3>
              <p className="text-zinc-500 text-[14px] leading-relaxed">
                64M events/sec ingestion, content-aware routing, WASM plugin
                connectors for Shopify, GitHub, and Cloudflare. One binary, one
                config.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1: Product analytics — 2-up mockups */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Make product
              <br />
              analytics self-driving
            </h2>
            <p className="text-zinc-400 text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              Funnels with per-step filters and breakdown. Cohort retention
              by day, week, or month. Lifecycle charts showing new, returning,
              and resurrected users. ML-powered churn prediction scores every
              user automatically.
            </p>
          </div>
          {/* Mockups — full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Funnels</span>
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Retention</span>
                <span className="text-[11px] text-zinc-400">Conversion tracking</span>
              </div>
              <div className="aspect-[4/3] rounded-xl border border-zinc-800/60 bg-[#111113]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Lifecycle</span>
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Stickiness</span>
                <span className="text-[11px] text-zinc-400">DAU/MAU ratios</span>
              </div>
              <div className="aspect-[4/3] rounded-xl border border-zinc-800/60 bg-[#111113]" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Audiences & ML — full-width mockup */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Define your
              <br />
              audiences with precision
            </h2>
            <p className="text-zinc-400 text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              Named audiences with behavioral rules, property filters, and ML
              predictions. "Users likely to churn this week" or "power users
              who haven't purchased." Cross-device identity resolution at query
              time.
            </p>
          </div>
          {/* Mockup — full width */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Audiences</span>
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Churn prediction</span>
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Segments</span>
          </div>
          <div className="aspect-[2.4/1] rounded-xl border border-zinc-800/60 bg-[#111113]" />
        </div>
      </section>

      {/* Feature 3: Connectors */}
      <ConnectorsSection />

      {/* Feature 4: CLI & AI — full-width mockup */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Query anything
              <br />
              from anywhere
            </h2>
            <p className="text-zinc-400 text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              Raw SQL via ClickHouse, live tail from the CLI, and an MCP server
              for AI assistants. Interactive TUI mode with dashboards, query
              builder, and streaming views. Ask your data questions in natural
              language.
            </p>
          </div>
          {/* Mockup — full width */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">SQL</span>
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">CLI</span>
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">MCP</span>
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">TUI</span>
          </div>
          <div className="aspect-[2.4/1] rounded-xl border border-zinc-800/60 bg-[#111113]" />
        </div>
      </section>

      {/* Feature 5: Collaboration — 2-up mockups */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
              Collaborate with
              <br />
              canvases and boards
            </h2>
            <p className="text-zinc-400 text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              Infinite zoomable canvases with live metric cards, text, shapes,
              and connections. Dashboards with configurable grid layouts and
              markdown notes. Share anything via secure URL with optional expiry.
            </p>
          </div>
          {/* Mockups — full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Canvases</span>
                <span className="text-[11px] text-zinc-400">Infinite zoom</span>
              </div>
              <div className="aspect-[4/3] rounded-xl border border-zinc-800/60 bg-[#111113]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Dashboards</span>
                <span className="text-[11px] text-zinc-400">Shared boards</span>
              </div>
              <div className="aspect-[4/3] rounded-xl border border-zinc-800/60 bg-[#111113]" />
            </div>
          </div>
        </div>
      </section>

      {/* Changelog */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto md:px-8">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white mb-16" style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}>
            Changelog
          </h2>

          {/* Timeline + cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
            {getAllEntries().slice(0, 4).map((entry, i) => (
              <Link to="/changelog/$slug" params={{ slug: entry.slug }} key={entry.slug} className="group block">
                {/* Timeline dot + line */}
                <div className="flex items-center mb-8">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? "bg-brand" : "bg-zinc-600"}`} />
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                <div className="pr-2">
                  <h3 className="text-white text-[15px] font-medium mb-2 leading-snug group-hover:text-brand transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-zinc-500 group-hover:text-zinc-200 text-[14px] leading-[1.5] mb-4 line-clamp-4 transition-colors">
                    {entry.summary}
                  </p>
                  <p className="text-zinc-400 group-hover:text-zinc-300 text-[12px] font-mono tracking-wide uppercase transition-colors">
                    {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(",", ",")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/changelog" className="inline-flex items-center gap-1.5 mt-12 text-[14px] text-zinc-500 hover:text-white transition-colors">
            See all releases <span>&rarr;</span>
          </Link>
        </div>
      </section>


      {/* Footer CTA — text inset */}
      <section className="py-32 md:py-44 px-6 relative overflow-hidden">
        <DotGrid focusPoints={[[0.95, 0.9], [0.05, 0.9]]} />
        <div className="max-w-[1340px] mx-auto text-center relative">
          <h2 className="text-[42px] md:text-[58px] font-semibold tracking-[-0.035em] text-white leading-[1.08] mb-10">
            Built for clarity.
            <br />
            Available today.
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-zinc-100 text-zinc-900 text-sm font-medium rounded-lg hover:bg-white transition"
            >
              Get Started
            </Link>
            <a
              href="mailto:hello@tell.rs"
              className="px-5 py-2.5 text-sm font-medium text-zinc-400 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-zinc-200 transition"
            >
              Contact
            </a>
          </div>
          <div className="mt-8 flex justify-center">
            <InstallBlock />
          </div>
        </div>
      </section>
    </div>
  );
}

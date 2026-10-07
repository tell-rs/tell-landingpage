import { MockStatCard } from "./shell-kit";
import { useEffect, useRef, useState } from "react";
import { useInView } from "./reveal";

/* ------------------------------------------------------------------ */
/*  Shared container                                                   */
/* ------------------------------------------------------------------ */

function MockFrame({ children }: { children: React.ReactNode }) {
  // Decorative product illustration — hide the fake UI from assistive tech
  return (
    <div aria-hidden="true" className="relative md:aspect-[2.4/1] rounded-xl border border-zinc-800/60 bg-[#111113] overflow-hidden">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Funnel + retention — product analytics                          */
/* ------------------------------------------------------------------ */

const funnelSteps = [
  { name: "Visited site", count: "48,201", pct: 100, conv: null },
  { name: "Signed up", count: "12,847", pct: 26.7, conv: "26.7%" },
  { name: "Created project", count: "8,412", pct: 17.4, conv: "65.5%" },
  { name: "Activated", count: "6,034", pct: 12.5, conv: "71.7%" },
  { name: "Upgraded to paid", count: "1,982", pct: 4.1, conv: "32.8%" },
];

// Weekly retention cohorts — % retained per week since signup
const cohorts = [
  { label: "Feb 3", weeks: [100, 58, 49, 44, 40, 37, 35, 34] },
  { label: "Feb 10", weeks: [100, 61, 52, 46, 42, 39, 37] },
  { label: "Feb 17", weeks: [100, 57, 47, 42, 38, 36] },
  { label: "Feb 24", weeks: [100, 63, 54, 48, 44] },
  { label: "Mar 3", weeks: [100, 65, 56, 51] },
  { label: "Mar 10", weeks: [100, 68, 59] },
  { label: "Mar 17", weeks: [100, 71] },
];

export function FunnelMock() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <MockFrame>
      <div ref={ref} className="md:absolute md:inset-0 grid grid-cols-1 md:grid-cols-[1.35fr_1fr]">
        {/* Funnel */}
        <div className="px-8 py-7 flex flex-col min-h-0">
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-white text-[14px] font-medium">Onboarding funnel</p>
            <p className="text-zinc-600 text-[12px] font-mono">Last 30 days</p>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-3">
            {funnelSteps.map((step, i) => (
              <div key={step.name}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-zinc-300 text-[13px]">{step.name}</span>
                  <span className="text-[12px] font-mono text-zinc-500" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {step.count}
                    {step.conv && <span className="text-zinc-600"> · {step.conv}</span>}
                  </span>
                </div>
                <div className="h-[22px] rounded-[4px] bg-zinc-800/30 overflow-hidden">
                  <div
                    className="h-full rounded-[4px]"
                    style={{
                      width: inView ? `${step.pct}%` : "0%",
                      minWidth: inView ? 14 : 0,
                      background: `linear-gradient(90deg, rgba(100,90,230,${0.95 - i * 0.12}), rgba(100,90,230,${0.55 - i * 0.07}))`,
                      transition: `width 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 110}ms, min-width 1.1s ${i * 110}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention cohorts */}
        <div className="hidden md:flex px-8 py-7 border-l border-zinc-800/40 flex-col min-h-0">
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-white text-[14px] font-medium">Retention</p>
            <p className="text-zinc-600 text-[12px] font-mono">Weekly cohorts</p>
          </div>
          {/* Header row */}
          <div className="grid grid-cols-[52px_repeat(8,1fr)] gap-[3px] mb-[3px]">
            <span />
            {Array.from({ length: 8 }, (_, w) => (
              <span key={w} className="text-center text-[10px] font-mono text-zinc-600">
                W{w}
              </span>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-[3px]">
            {cohorts.map((cohort, r) => (
              <div key={cohort.label} className="grid grid-cols-[52px_repeat(8,1fr)] gap-[3px] flex-1 min-h-0">
                <span className="text-[10px] font-mono text-zinc-600 self-center">{cohort.label}</span>
                {Array.from({ length: 8 }, (_, c) => {
                  const v = cohort.weeks[c];
                  if (v === undefined) return <span key={c} />;
                  const alpha = 0.06 + (v / 100) * 0.85;
                  return (
                    <div
                      key={c}
                      className="rounded-[3px] flex items-center justify-center"
                      style={{
                        backgroundColor: `rgba(100,90,230,${alpha})`,
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.5s ease ${(r + c) * 45}ms`,
                      }}
                    >
                      <span className={`text-[10px] font-mono ${v > 55 ? "text-white/90" : "text-zinc-400"}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                        {v}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Logs + infra metrics — observability                            */
/* ------------------------------------------------------------------ */

type MockLog = { id: number; time: string; level: "ERROR" | "WARN" | "INFO" | "DEBUG"; service: string; msg: string; anomaly?: number };

const logPool: Omit<MockLog, "id" | "time">[] = [
  { level: "INFO", service: "ingestion", msg: "Batch processed: 3,891 events in 14ms — 0 dropped" },
  { level: "ERROR", service: "api-gateway", msg: `POST /v1/events 502 — {"code":"DECODE_FAILED","sdk":"ios-2.4.1"}`, anomaly: 0.94 },
  { level: "INFO", service: "redact", msg: `POST /v1/signup 201 — {"email":"[REDACTED:email]","plan":"pro"}` },
  { level: "WARN", service: "connector", msg: "GitHub rate limit: 4,812/5,000 — throttling to 2 req/s" },
  { level: "DEBUG", service: "clickhouse", msg: "Index scan: 12M rows in 34ms, mark cache hit 99.2%" },
  { level: "INFO", service: "wasm-rt", msg: "Plugin stripe-payments: 23 charges synced, 2 refunds" },
  { level: "INFO", service: "witness", msg: "host web-2: 64 metrics shipped — cpu, mem, disk, net, tcp" },
  { level: "WARN", service: "clickhouse", msg: "Slow query 842ms — uniq(user_id) over 7d window", anomaly: 0.71 },
  { level: "DEBUG", service: "storage", msg: "Merge completed: 2.4 GiB, 14.2M rows in 1.23s" },
  { level: "INFO", service: "redact", msg: `checkout event — {"card":"[REDACTED:credit_card]","amount":"$49"}` },
];

const logLevelColor: Record<MockLog["level"], string> = {
  ERROR: "text-red-400",
  WARN: "text-amber-400",
  INFO: "text-[#818cf8]",
  DEBUG: "text-zinc-500",
};

const sparkCpu = [38, 41, 39, 44, 42, 47, 45, 43, 48, 52, 46, 44, 41, 43, 42, 45];
const sparkP95 = [124, 118, 131, 122, 115, 119, 128, 141, 126, 118, 114, 117, 121, 116, 118, 115];
const sparkMem = [1.8, 1.9, 1.9, 2.0, 2.0, 2.1, 2.0, 2.1, 2.2, 2.1, 2.1, 2.0, 2.1, 2.1, 2.2, 2.1];

function Sparkline({ data, height = 36 }: { data: number[]; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - 4 - ((v - min) / range) * (height - 10)}`);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polygon points={`0,${height} ${points.join(" ")} ${w},${height}`} fill="rgba(100,90,230,0.12)" />
      <polyline points={points.join(" ")} fill="none" stroke="#645AE6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const metricCards = [
  { label: "CPU (p95)", value: "42%", delta: "\u2191 2.1%", up: false, data: sparkCpu },
  { label: "API latency (p99)", value: "118 ms", delta: "\u2193 6 ms", up: true, data: sparkP95 },
  { label: "Memory", value: "2.1 GiB", delta: "flat", up: null, data: sparkMem },
];

export function LogsMock() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [logs, setLogs] = useState<MockLog[]>(() =>
    [...logPool, ...logPool.slice(0, 3)].map((l, i) => ({ ...l, id: i, time: `16:04:${(52 - i * 3).toString().padStart(2, "0")}.${((137 + i * 61) % 1000).toString().padStart(3, "0")}` })),
  );
  const nextId = useRef(13);
  const nextSec = useRef(53);
  const lastTemplate = useRef(-1);

  useEffect(() => {
    if (!inView) return;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = nextSec.current++;
      const min = 4 + Math.floor(s / 60);
      const time = `16:${min.toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}.${Math.floor(Math.random() * 999).toString().padStart(3, "0")}`;
      let idx = Math.floor(Math.random() * logPool.length);
      if (idx === lastTemplate.current) idx = (idx + 1) % logPool.length;
      lastTemplate.current = idx;
      setLogs((prev) => [{ ...logPool[idx], id: nextId.current++, time }, ...prev].slice(0, 13));
      timeout = setTimeout(tick, 1800 + Math.random() * 2400);
    };
    timeout = setTimeout(tick, 1200);
    return () => clearTimeout(timeout);
  }, [inView]);

  return (
    <MockFrame>
      <div ref={ref} className="md:absolute md:inset-0 grid grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        {/* Log stream */}
        <div className="flex flex-col min-h-0 py-5">
          <div className="flex items-center gap-3 px-7 pb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" style={{ animationDuration: "2s" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-white text-[14px] font-medium">Live tail</span>
            <span className="text-zinc-600 text-[12px] font-mono">production · all services</span>
          </div>
          <div className="relative flex-1 overflow-hidden font-mono text-[12px] leading-none">
            {logs.map((log) => (
              <div key={log.id} className="log-row flex items-center gap-3 px-7 py-[9px] border-b border-zinc-800/20 whitespace-nowrap">
                <span className="text-zinc-600 shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>{log.time}</span>
                <span className={`w-[46px] shrink-0 ${logLevelColor[log.level]}`}>{log.level}</span>
                <span className="text-zinc-500 bg-zinc-800/60 rounded px-1.5 py-[2px] text-[10.5px] shrink-0">{log.service}</span>
                {log.anomaly && (
                  <span className="text-red-300/90 bg-red-400/10 rounded px-1.5 py-[2px] text-[10.5px] shrink-0">
                    anomaly {log.anomaly}
                  </span>
                )}
                <span className="text-zinc-400 truncate">{log.msg}</span>
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#111113] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Infra metrics */}
        <div className="hidden md:flex flex-col border-l border-zinc-800/40 px-6 py-5 gap-3 min-h-0">
          <div className="flex items-baseline justify-between pb-1">
            <p className="text-white text-[14px] font-medium">Infrastructure</p>
            <p className="text-zinc-600 text-[12px]">14 hosts</p>
          </div>
          {metricCards.map((card, i) => (
            <div
              key={card.label}
              className="flex-1 min-h-0 rounded-xl border border-zinc-800/40 bg-transparent px-5 pt-3 pb-2 flex flex-col"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(12px)",
                transition: `opacity 0.6s ease ${200 + i * 130}ms, transform 0.6s ease ${200 + i * 130}ms`,
              }}
            >
              <span className="text-zinc-400 text-[12px] leading-[17px] font-medium truncate">{card.label}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-white text-[26px] leading-none tracking-[-0.022em]" style={{ fontWeight: 510, fontVariantNumeric: "tabular-nums slashed-zero" }}>
                  {card.value}
                </span>
                <span className={`text-[12px] font-medium ${card.up === true ? "text-emerald-400" : card.up === false ? "text-red-400" : "text-zinc-600"}`}>
                  {card.delta}
                </span>
              </div>
              <div className="mt-auto -mx-1">
                <Sparkline data={card.data} height={30} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Count-up hook                                                      */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

/* ------------------------------------------------------------------ */
/*  3. Terminal — AI / MCP / CLI                                       */
/* ------------------------------------------------------------------ */

function useTyped(text: string, active: boolean, speed = 26, startDelay = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let interval: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      interval = setInterval(() => {
        setN((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [active, text, speed, startDelay]);
  return { shown: text.slice(0, n), done: n >= text.length };
}

const askCommand = `tell ask "why did signups spike yesterday?"`;
const tailCommand = "tell tail --level error";

type TermLine =
  | { kind: "text"; text: string; cls: string }
  | { kind: "gap" }
  | { kind: "bar"; label: string; pct: number; value: string };

const answerLines: TermLine[] = [
  { kind: "text", text: "Signups spiked 3.4x on Tuesday (312 → 1,047).", cls: "text-zinc-300" },
  { kind: "text", text: "62% arrived from a Hacker News post at 09:14 UTC.", cls: "text-zinc-300" },
  { kind: "text", text: "HN cohort activation is 2.1x the organic baseline.", cls: "text-zinc-300" },
  { kind: "gap" },
  { kind: "bar", label: "hn", pct: 100, value: "647" },
  { kind: "bar", label: "organic", pct: 33, value: "214" },
  { kind: "bar", label: "twitter", pct: 15, value: "98" },
  { kind: "bar", label: "direct", pct: 13.5, value: "88" },
  { kind: "gap" },
  { kind: "text", text: "→ board created: hn-cohort-analysis", cls: "text-brand" },
  { kind: "gap" },
];

const tailPool = [
  { service: "api-gateway", msg: `POST /v1/events 502 — DECODE_FAILED, sdk ios-2.4.1` },
  { service: "connector", msg: "stripe webhook signature verification failed (401)" },
  { service: "connector", msg: "shopify rate limit exceeded — retrying in 30s" },
  { service: "ingestion", msg: "enrichment failed for 1 event — geoip timeout" },
];

const surfaceCards = [
  {
    label: "MCP",
    desc: "60+ tools for Claude, Cursor, or any agent you build.",
    code: "claude mcp add tell",
  },
  {
    label: "SQL",
    desc: "Raw ClickHouse access. Your queries, no DSL in the way.",
    code: "SELECT uniq(user_id) FROM events",
  },
  {
    label: "CLI",
    desc: "Live tail, interactive TUI, scriptable JSON output.",
    code: "tell tail --level error",
  },
];

export function TerminalMock() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const { shown: typedCmd, done: cmdDone } = useTyped(askCommand, inView, 24, 400);
  const [thinking, setThinking] = useState(false);
  const [answered, setAnswered] = useState(0);
  const answerDone = answered >= answerLines.length;
  const { shown: typedTail, done: tailCmdDone } = useTyped(tailCommand, answerDone, 30, 700);
  const [tailLines, setTailLines] = useState<{ id: number; time: string; service: string; msg: string }[]>([]);
  const tailId = useRef(0);
  const tailSec = useRef(4);

  useEffect(() => {
    if (!cmdDone) return;
    const t1 = setTimeout(() => setThinking(true), 250);
    const t2 = setTimeout(() => {
      setThinking(false);
      // reveal answer lines one by one
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setAnswered(i);
        if (i >= answerLines.length) clearInterval(interval);
      }, 140);
    }, 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [cmdDone]);

  // Endless error tail after the second command
  useEffect(() => {
    if (!tailCmdDone) return;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = tailSec.current;
      tailSec.current += 7 + Math.floor(Math.random() * 20);
      const time = `16:${(5 + Math.floor(s / 60)).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
      const template = tailPool[tailId.current % tailPool.length];
      setTailLines((prev) => [...prev, { id: tailId.current++, time, ...template }].slice(-4));
      timeout = setTimeout(tick, 1600 + Math.random() * 2200);
    };
    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [tailCmdDone]);

  return (
    <MockFrame>
      <div ref={ref} className="md:absolute md:inset-0 grid grid-cols-1 md:grid-cols-[1.55fr_1fr]">
        {/* Terminal */}
        <div className="p-6 md:p-8 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 rounded-lg border border-zinc-800/60 bg-[#0c0c0e] flex flex-col overflow-hidden shadow-2xl">
            <div className="h-[36px] flex items-center gap-2 px-4 border-b border-zinc-800/50 shrink-0">
              <span className="w-[10px] h-[10px] rounded-full bg-zinc-700" />
              <span className="w-[10px] h-[10px] rounded-full bg-zinc-700" />
              <span className="w-[10px] h-[10px] rounded-full bg-zinc-700" />
              <span className="ml-3 text-zinc-600 text-[11px] font-mono">tell — zsh</span>
            </div>
            <div className="flex-1 overflow-hidden px-5 py-4 font-mono text-[12.5px] leading-[1.8]">
              <div className="text-zinc-300">
                <span className="text-brand">$ </span>
                {typedCmd}
                {!cmdDone && <span className="terminal-cursor" />}
              </div>
              {thinking && (
                <div className="text-zinc-600 mt-1">
                  <span className="thinking-dots">analyzing events, logs, stripe, github</span>
                </div>
              )}
              {answerLines.slice(0, answered).map((line, i) => {
                if (line.kind === "gap") return <div key={i} className="h-[0.7em]" />;
                if (line.kind === "bar")
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-zinc-500 w-[64px] shrink-0">{line.label}</span>
                      <div className="w-[200px]">
                        <div className="h-[9px] rounded-[2px] bg-brand/75" style={{ width: `${line.pct}%` }} />
                      </div>
                      <span className="text-zinc-400 text-right w-[36px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {line.value}
                      </span>
                    </div>
                  );
                return (
                  <div key={i} className={`${line.cls} whitespace-pre`}>
                    {line.text}
                  </div>
                );
              })}
              {answerDone && (
                <div className="text-zinc-300">
                  <span className="text-brand">$ </span>
                  {typedTail}
                  {!tailCmdDone && <span className="terminal-cursor" />}
                </div>
              )}
              {tailLines.map((line) => (
                <div key={line.id} className="whitespace-nowrap truncate">
                  <span className="text-zinc-600">{line.time} </span>
                  <span className="text-red-400">ERROR </span>
                  <span className="text-zinc-500">{line.service} </span>
                  <span className="text-zinc-400">{line.msg}</span>
                </div>
              ))}
              {tailCmdDone && (
                <div className="text-zinc-600">
                  <span className="terminal-cursor" style={{ background: "#3f3f46" }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Surfaces */}
        <div className="hidden md:flex flex-col justify-center gap-3 pr-8 py-8">
          {surfaceCards.map((card, i) => (
            <div
              key={card.label}
              className="rounded-lg border border-zinc-800/50 bg-[#151517] px-5 py-4"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateX(16px)",
                transition: `opacity 0.6s ease ${300 + i * 150}ms, transform 0.6s ease ${300 + i * 150}ms`,
              }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-brand text-[11px] font-mono font-medium tracking-wider">{card.label}</span>
              </div>
              <p className="text-zinc-400 text-[13px] leading-snug mb-2.5">{card.desc}</p>
              <code className="text-zinc-500 text-[11.5px] font-mono bg-zinc-800/40 rounded px-2 py-1 inline-block">
                {card.code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Audiences — rule builder + identity resolution                  */
/* ------------------------------------------------------------------ */

const audienceRules = [
  { kw: "WHERE", field: "plan", op: "=", value: "pro", ml: false },
  { kw: "AND", field: "sessions_14d", op: "<", value: "3", ml: false },
  { kw: "AND", field: "last_seen", op: ">", value: "7 days ago", ml: false },
  { kw: "AND", field: "churn_score", op: ">", value: "0.7", ml: true },
];

const identities = [
  { source: "web", id: "fp_29c1a8", meta: "Safari · macOS", when: "active now" },
  { source: "ios", id: "device_a8f2e1", meta: "iPhone 17 Pro", when: "2 min ago" },
  { source: "stripe", id: "cus_9X2f8a", meta: "Pro · $99/mo", when: "linked 3d ago" },
];

// churn_score distribution, 20 buckets over 0..1 — threshold at 0.7 (bucket 14)
const scoreDist = [2, 4, 7, 10, 14, 18, 22, 19, 15, 12, 10, 9, 8, 7, 7, 6, 5, 4, 3, 2];

export function AudienceMock() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const matched = useCountUp(1284, inView);

  return (
    <MockFrame>
      <div ref={ref} className="md:absolute md:inset-0 grid grid-cols-1 md:grid-cols-[1.35fr_1fr]">
        {/* Rule builder */}
        <div className="px-8 py-7 flex flex-col min-h-0">
          <div className="flex items-baseline justify-between mb-5">
            <p className="text-white text-[14px] font-medium">Audiences</p>
            <p className="text-zinc-600 text-[12px] font-mono">4 synced</p>
          </div>

          {/* Selected audience */}
          <div className="rounded-lg border border-zinc-800/50 bg-[#151517] px-5 pt-4 pb-5 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-200 text-[14px] font-medium">Likely to churn this week</span>
                <span className="text-[10px] font-mono font-medium text-brand bg-brand/15 rounded px-1.5 py-[2px] tracking-wider">ML</span>
              </div>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" style={{ animationDuration: "2.5s" }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            </div>

            {/* Rules */}
            <div className="space-y-2 font-mono text-[12px]">
              {audienceRules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "none" : "translateY(8px)",
                    transition: `opacity 0.5s ease ${150 + i * 120}ms, transform 0.5s ease ${150 + i * 120}ms`,
                  }}
                >
                  <span className="text-brand w-[46px] shrink-0">{rule.kw}</span>
                  <span className="text-zinc-300 bg-zinc-800/60 rounded px-2 py-[3px]">{rule.field}</span>
                  <span className="text-zinc-600">{rule.op}</span>
                  <span className="text-zinc-300 bg-zinc-800/60 rounded px-2 py-[3px]">{rule.value}</span>
                  {rule.ml && <span className="text-zinc-600 text-[10.5px]">churn model v4</span>}
                </div>
              ))}
            </div>

            {/* Churn score distribution with threshold */}
            <div className="flex-1 min-h-0 flex flex-col justify-end mt-6 mb-1">
              <div className="relative">
                <div className="flex items-end gap-[3px] h-[72px]">
                  {scoreDist.map((v, i) => {
                    const past = i >= 14;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t-[2px]"
                        style={{
                          height: inView ? `${(v / 22) * 100}%` : "0%",
                          backgroundColor: past ? "rgba(100,90,230,0.9)" : "rgba(113,113,122,0.25)",
                          transition: `height 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${400 + i * 35}ms`,
                        }}
                      />
                    );
                  })}
                </div>
                {/* Threshold marker at 0.7 */}
                <div className="absolute inset-y-0 pointer-events-none" style={{ left: "70%" }}>
                  <div className="h-full border-l border-dashed border-brand/60" />
                  <span className="absolute -top-0.5 left-1.5 text-[10px] font-mono text-brand whitespace-nowrap">&gt; 0.7</span>
                </div>
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] font-mono text-zinc-600">
                <span>churn_score 0</span>
                <span>1</span>
              </div>
            </div>

            {/* Matched count */}
            <div className="pt-4 flex items-end justify-between border-t border-zinc-800/40">
              <div>
                <p className="text-white text-[30px] leading-none tracking-tight" style={{ fontWeight: 510, fontVariantNumeric: "tabular-nums" }}>
                  {matched.toLocaleString()}
                </p>
                <p className="text-zinc-500 text-[12px] mt-1.5">users match · updates live</p>
              </div>
              <p className="text-zinc-600 text-[11px] font-mono text-right leading-relaxed">
                syncs to stripe<br />meta ads · webhook
              </p>
            </div>
          </div>
        </div>

        {/* Identity resolution */}
        <div className="hidden md:flex px-8 py-7 border-l border-zinc-800/40 flex-col min-h-0">
          <div className="flex items-baseline justify-between mb-5">
            <p className="text-white text-[14px] font-medium">Identity resolution</p>
            <p className="text-zinc-600 text-[12px] font-mono">query time</p>
          </div>

          {/* Resolved profile */}
          <div
            className="flex items-center gap-3 mb-5"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 0.6s ease 200ms",
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#645AE6] to-[#3b348c] flex items-center justify-center text-white text-[13px] font-medium shrink-0">
              SM
            </div>
            <div className="min-w-0">
              <p className="text-zinc-200 text-[14px] font-medium leading-tight">Sarah Miller</p>
              <p className="text-zinc-500 text-[12.5px] leading-tight truncate">sarah@acme.com</p>
            </div>
            <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-400/10 rounded px-1.5 py-[2px] tracking-wider shrink-0">
              1 PERSON
            </span>
          </div>

          {/* Merged identities */}
          <div className="relative flex-1 min-h-0 flex flex-col gap-3">
            <div className="absolute left-[7px] top-2 bottom-8 w-px bg-zinc-800" />
            {identities.map((identity, i) => (
              <div
                key={identity.source}
                className="relative flex items-center gap-3.5"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateX(12px)",
                  transition: `opacity 0.5s ease ${350 + i * 160}ms, transform 0.5s ease ${350 + i * 160}ms`,
                }}
              >
                <span className="relative z-10 w-[15px] h-[15px] rounded-full border-2 border-brand bg-[#111113] shrink-0" />
                <div className="flex-1 min-w-0 rounded-lg border border-zinc-800/50 bg-[#151517] px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] text-zinc-300 truncate">
                      <span className="text-zinc-500">{identity.source} · </span>
                      {identity.id}
                    </p>
                    <p className="text-zinc-600 text-[11px] mt-0.5">{identity.meta}</p>
                  </div>
                  <span className="text-zinc-600 text-[11px] font-mono whitespace-nowrap shrink-0">{identity.when}</span>
                </div>
              </div>
            ))}
            {/* Merge event */}
            <div
              className="relative flex items-center gap-3.5"
              style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 850ms" }}
            >
              <span className="relative z-10 w-[15px] h-[15px] rounded-full bg-brand shrink-0 flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <p className="font-mono text-[11.5px] text-zinc-500">
                anonymous session <span className="text-brand">→ merged</span> · just now
              </p>
            </div>

            <p
              className="relative text-zinc-600 text-[11.5px] leading-snug pl-[30px] mt-auto"
              style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 1000ms" }}
            >
              3 devices, 1 person — merged at query time. No batch stitching jobs.
            </p>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  4b. Marketing data — growth channels next to product signups       */
/* ------------------------------------------------------------------ */

// 12 weeks of fake data — signups (bars) with MRR, GitHub stars, YouTube subs (lines)
const mkWeeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
const mkSignups = [120, 135, 128, 150, 162, 158, 180, 210, 268, 305, 330, 362];
const mkMrr = [38.2, 39.0, 39.6, 40.5, 41.2, 42.1, 43.0, 43.8, 45.1, 46.3, 47.2, 48.2];
const mkStars = [2610, 2680, 2750, 2830, 2905, 2990, 3080, 3190, 3420, 3560, 3700, 3847];
const mkSubs = [9.2, 9.4, 9.6, 9.8, 10.1, 10.3, 10.6, 10.9, 11.2, 11.5, 11.8, 12.1];

const mkSeries = [
  { key: "mrr", label: "MRR", color: "#645AE6", data: mkMrr },
  { key: "stars", label: "GitHub stars", color: "#a1a1aa", data: mkStars },
  { key: "subs", label: "YouTube subs", color: "#f59e0b", data: mkSubs },
];

const mkStats = [
  { label: "Stripe MRR", value: "$48.2K", delta: "↑ 8%" },
  { label: "GitHub stars", value: "3,847", delta: "↑ 235" },
  { label: "YouTube subs", value: "12.1K", delta: "↑ 4%" },
  { label: "Ad ROAS", value: "3.2x", delta: "↑ 0.4" },
];

// Normalize a series into polyline points inside a 100x60 viewBox band
function mkPoints(data: number[]): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${54 - ((v - min) / range) * 44}`)
    .join(" ");
}

export function MarketingMock() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const maxSignups = Math.max(...mkSignups);

  return (
    <MockFrame>
      <div ref={ref} className="md:absolute md:inset-0 grid grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        {/* Multi-series chart */}
        <div className="px-8 py-7 flex flex-col min-h-0">
          <div className="flex items-baseline justify-between mb-5">
            <p className="text-white text-[14px] font-medium">Growth channels · signups</p>
            <p className="text-zinc-600 text-[12px] font-mono">Last 12 weeks</p>
          </div>
          <div className="relative flex-1 min-h-[220px]">
            {/* Signup bars */}
            <div className="absolute inset-x-0 bottom-[18px] top-0 flex items-end gap-[6px]">
              {mkSignups.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: "100%" }}>
                  <div
                    className="w-full rounded-t-[3px]"
                    style={{
                      height: inView ? `${(v / maxSignups) * 78}%` : "0%",
                      backgroundColor: "rgba(129,140,248,0.22)",
                      transition: `height 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${i * 45}ms`,
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Series lines */}
            <svg
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              className="absolute inset-x-0 bottom-[18px] top-0 w-full h-[calc(100%-18px)]"
              style={{
                clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 1.6s cubic-bezier(0.16, 1, 0.3, 1) 300ms",
              }}
            >
              {mkSeries.map((s, i) => (
                <polyline
                  key={s.key}
                  points={mkPoints(s.data)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="0.45"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={inView ? 1 : 0}
                  style={{ transition: `opacity 0.5s ease ${300 + i * 180}ms` }}
                />
              ))}
            </svg>
            {/* X axis */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] font-mono text-zinc-600">
              {mkWeeks.filter((_, i) => i % 2 === 0).map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-zinc-500 shrink-0">
            {mkSeries.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5">
                <span className="w-2 h-[2px] rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: "rgba(129,140,248,0.35)" }} />
              Signups
            </span>
          </div>
        </div>

        {/* Channel stat cards */}
        <div className="hidden md:flex flex-col border-l border-zinc-800/40 px-6 py-5 gap-3 min-h-0">
          <div className="flex items-baseline justify-between pb-1">
            <p className="text-white text-[14px] font-medium">This week</p>
            <p className="text-zinc-600 text-[12px] font-mono">4 sources</p>
          </div>
          {mkStats.map((stat, i) => (
            <MockStatCard
              key={stat.label}
              title={stat.label}
              value={stat.value}
              delta={stat.delta}
              up
              className="flex-1 min-h-0"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(12px)",
                transition: `opacity 0.6s ease ${200 + i * 130}ms, transform 0.6s ease ${200 + i * 130}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Share — shared board with presence + comment mark               */
/* ------------------------------------------------------------------ */

const shareChart = [42, 44, 41, 47, 52, 49, 55, 58, 54, 62, 66, 63, 71, 74, 78, 84];

// Fixed y domain 40..90 ($K) so gridlines and labels line up exactly
const shareYMin = 40;
const shareYMax = 90;
const shareYTicks = [
  { label: "$80K", value: 80 },
  { label: "$60K", value: 60 },
  { label: "$40K", value: 40 },
];

function shareYPct(v: number): number {
  return ((shareYMax - v) / (shareYMax - shareYMin)) * 100;
}

// Smooth monotone-style path through the series in a 100x100 viewBox
function sharePath(data: number[]): string {
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: shareYPct(v),
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const dx = (p1.x - p0.x) / 2;
    d += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function ShareMock() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [commentVisible, setCommentVisible] = useState(false);
  const [sharedOpen, setSharedOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const sharedRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setCommentVisible(true), 1200);
    return () => clearTimeout(t);
  }, [inView]);

  useEffect(() => {
    if (!sharedOpen) return;
    const onDown = (e: MouseEvent) => {
      if (sharedRef.current && !sharedRef.current.contains(e.target as Node)) {
        setSharedOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [sharedOpen]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://tell.rs/b/q1-growth");
    } catch {
      // clipboard unavailable — still show visual feedback
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <MockFrame>
      <div ref={ref} className="md:absolute md:inset-0 p-6 md:p-8 flex flex-col">
        {/* Shared board — full width */}
        <div className="relative flex-1 min-h-0 rounded-lg border border-zinc-800/60 bg-[#151517] shadow-2xl flex flex-col overflow-hidden">
          {/* Board header */}
          <div className="flex items-center justify-between px-5 h-[52px] border-b border-zinc-800/50 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-white text-[14px] font-medium">Q1 Growth</span>
              <button
                type="button"
                onClick={copyLink}
                className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 bg-zinc-800/50 rounded-md px-2 py-1 cursor-pointer hover:bg-zinc-800/80 hover:text-zinc-300 transition"
              >
                tell.rs/b/q1-growth
                {copied ? (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-emerald-400 font-sans">Copied</span>
                  </>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
            </div>
            <div className="relative" ref={sharedRef}>
              <button
                type="button"
                onClick={() => setSharedOpen((o) => !o)}
                className="group/share flex items-center cursor-pointer"
              >
                <div className="flex -space-x-1.5">
                  <span className="w-[22px] h-[22px] rounded-full bg-[#22d3ee]/80 border-2 border-[#151517] flex items-center justify-center text-[9px] font-medium text-zinc-900">L</span>
                  <span className="w-[22px] h-[22px] rounded-full bg-[#f59e0b]/80 border-2 border-[#151517] flex items-center justify-center text-[9px] font-medium text-zinc-900">M</span>
                  <span className="w-[22px] h-[22px] rounded-full bg-brand border-2 border-[#151517] flex items-center justify-center text-[9px] font-medium text-white">S</span>
                </div>
                <span className="text-zinc-500 group-hover/share:text-zinc-300 text-[11px] ml-2.5 transition">+5 viewing</span>
              </button>
              {sharedOpen && (
                <div className="absolute top-full right-0 mt-2 w-[248px] rounded-lg border border-zinc-800/60 bg-[#1a1a1c] shadow-xl z-20 py-1">
                  <div className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600">Shared with</div>
                  {[
                    { name: "Sarah Chen", sub: "sarah@acme.com", role: "Owner" },
                    { name: "Growth team", sub: "8 members", role: "Editor" },
                    { name: "investors", sub: "link access", role: "Viewer" },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center justify-between px-3 py-1.5">
                      <div className="min-w-0">
                        <div className="text-[12px] text-zinc-300 leading-snug truncate">{m.name}</div>
                        <div className="text-[10px] text-zinc-600 leading-snug truncate">{m.sub}</div>
                      </div>
                      <span className="shrink-0 ml-3 text-[10px] text-zinc-400 bg-zinc-800/70 border border-zinc-700/50 rounded-full px-1.5 py-0.5">{m.role}</span>
                    </div>
                  ))}
                  <div className="my-1 border-t border-zinc-800/60" />
                  <div className="flex items-center gap-1.5 px-3 pt-1 pb-1.5 text-[11px] text-zinc-500">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 shrink-0">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                    Anyone with the link can view
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart canvas */}
          <div className="relative flex-1 min-h-[180px] px-5 pt-4 pb-3 flex flex-col">
            <div className="flex items-baseline gap-2.5 mb-3 shrink-0">
              <span className="text-zinc-400 text-[12px] leading-[17px] font-medium">MRR · this quarter</span>
              <span className="text-emerald-400 text-[12px] font-medium">↑ 24%</span>
            </div>
            <div className="relative flex-1 min-h-0 flex">
              {/* Y-axis tick labels */}
              <div className="relative w-[36px] shrink-0">
                {shareYTicks.map((t) => (
                  <span
                    key={t.label}
                    className="absolute right-2 -translate-y-1/2 text-[10px] text-zinc-500"
                    style={{ top: `${shareYPct(t.value)}%`, fontVariantNumeric: "tabular-nums" }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
              {/* Plot area */}
              <div className="relative flex-1 min-h-0">
                {/* Horizontal dashed gridlines */}
                {shareYTicks.map((t) => (
                  <div
                    key={t.label}
                    className="absolute inset-x-0 border-t border-dashed border-zinc-800/30"
                    style={{ top: `${shareYPct(t.value)}%` }}
                  />
                ))}
                {/* Line — indigo, no area fill */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full overflow-visible"
                  style={{
                    clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                    transition: "clip-path 1.4s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                  }}
                >
                  <path
                    d={sharePath(shareChart)}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Mark anchor dot — pinned to the dip on the line */}
                <span
                  className="absolute z-10 w-[8px] h-[8px] rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(8 / (shareChart.length - 1)) * 100}%`,
                    top: `${shareYPct(shareChart[8])}%`,
                    backgroundColor: "#6366f1",
                    boxShadow: "0 0 0 2px #151517",
                    opacity: commentVisible ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                />
                {/* Comment mark */}
                <div
                  className="absolute z-10"
                  style={{
                    left: "51%",
                    top: "44%",
                    opacity: commentVisible ? 1 : 0,
                    transform: commentVisible ? "none" : "translateY(6px) scale(0.96)",
                    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="w-[22px] h-[22px] rounded-full rounded-bl-[4px] bg-[#22d3ee] flex items-center justify-center text-[9px] font-medium text-zinc-900 shrink-0 shadow-lg">L</span>
                    <div className="rounded-lg rounded-tl-[4px] border border-zinc-700/60 bg-[#1d1d21] shadow-xl px-3 py-2 max-w-[220px]">
                      <p className="text-zinc-300 text-[11.5px] leading-snug">Dip after the 2.1 release — pricing page A/B is live, watching it</p>
                      <p className="text-zinc-600 text-[10px] font-mono mt-1">lena · 2m ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 shrink-0 mt-2 pl-[36px]">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Now</span>
            </div>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

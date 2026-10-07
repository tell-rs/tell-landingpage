import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Shell mock kit — ONE set of primitives for the hero AppShell,      */
/*  styled to the real tell-web rendering contract:                    */
/*                                                                     */
/*  · MetricCard chrome: border-zinc-800/40 rounded-xl transparent bg, */
/*    header px-6 py-2.5 with 12px zinc-400 medium "title · sub",      */
/*    values 32px fontWeight 510 tabular-nums slashed-zero -0.022em,   */
/*    delta as plain colored text (↑ emerald-400 / ↓ red-400 / muted). */
/*  · Charts: indigo #6366f1, horizontal dashed grid only              */
/*    (zinc-800/30), 10px muted ticks, no axis lines.                  */
/*  · DataExplorer tables: 13px, zinc-400 headers over border-b        */
/*    zinc-800/30, rows border-b zinc-800/15, tabular numerics.        */
/*  · Canvas nodes: rounded-xl border bg-card p-3, 2xl semibold value, */
/*    delta chip (arrow + tinted bg), h-9 brand area sparkline.        */
/* ------------------------------------------------------------------ */

const CHART_COLOR = "#6366f1"; // indigo-500 — tell-web's CHART_COLOR
const BRAND = "#645AE6"; // tell-web --brand — canvas sparklines

const VALUE_STYLE: CSSProperties = {
  fontWeight: 510,
  fontVariantNumeric: "tabular-nums slashed-zero",
  letterSpacing: "-0.022em",
};

const TABULAR: CSSProperties = { fontVariantNumeric: "tabular-nums" };

/* ---------------------------- card chrome -------------------------- */

/** MetricCard header band — full-width, `title · sub` in one muted line. */
function MockCardHeader({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-6 py-2.5">
      <p className="text-zinc-400 text-[12px] leading-[17px] font-medium truncate flex-1">
        {title}
        {sub ? ` · ${sub}` : ""}
      </p>
      {right}
    </div>
  );
}

/** Delta rendered exactly like MetricCard's ComparisonText — plain colored text. */
export function MockDelta({ delta, up }: { delta: string; up?: boolean | null }) {
  const tone = up === true ? "text-emerald-400" : up === false ? "text-red-400" : "text-zinc-500";
  return (
    <span className={`text-[13px] font-medium ${tone}`} style={TABULAR}>
      {delta}
    </span>
  );
}

/** Stat card — the MetricVisualization number card (32px value + delta text). */
export function MockStatCard({
  title,
  sub,
  value,
  delta,
  up,
  className = "",
  style,
}: {
  title: string;
  sub?: string;
  value: string;
  delta?: string;
  up?: boolean | null;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`rounded-xl border border-zinc-800/40 bg-transparent flex flex-col overflow-hidden ${className}`} style={style}>
      <MockCardHeader title={title} sub={sub} />
      <div className="flex-1 flex flex-col justify-center" style={{ padding: "0 24px 22px" }}>
        <div className="flex items-baseline gap-3">
          <span className="text-white text-[32px] leading-[36px]" style={VALUE_STYLE}>
            {value}
          </span>
          {delta && <MockDelta delta={delta} up={up} />}
        </div>
      </div>
    </div>
  );
}

/** Panel card — MetricCard chrome around arbitrary content (charts, tables).
 *  `flush` drops the chart padding so tables run edge-to-edge. */
export function MockPanelCard({
  title,
  sub,
  right,
  flush = false,
  className = "",
  children,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  flush?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-zinc-800/40 bg-transparent flex flex-col overflow-hidden ${className}`}>
      <MockCardHeader title={title} sub={sub} right={right} />
      <div className={`flex-1 min-h-0 flex flex-col ${flush ? "" : "px-4 pb-[22px]"}`}>{children}</div>
    </div>
  );
}

/** The board's effective-range badge (MetricCard header, right side). */
export function MockRangeBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="shrink-0 rounded border border-zinc-700/50 px-1.5 py-px text-[10px] leading-[14px] text-zinc-500"
      style={TABULAR}
    >
      {children}
    </span>
  );
}

/* ------------------------------ toolbar ---------------------------- */

/** View toolbar — 48px title band with muted subtitle and right-side meta. */
export function MockToolbar({ title, sub, right, divider = false }: { title: string; sub?: string; right?: ReactNode; divider?: boolean }) {
  return (
    <div
      className={`h-[48px] flex items-center justify-between pr-5 shrink-0 ${divider ? "border-b border-zinc-800/30" : ""}`}
      style={{ paddingLeft: "32px" }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-white font-medium text-[14px] whitespace-nowrap">{title}</span>
        {sub && <span className="text-zinc-600 text-[12px] truncate">· {sub}</span>}
      </div>
      {right && <div className="flex items-center gap-3 text-[13px] text-zinc-500 shrink-0">{right}</div>}
    </div>
  );
}

/* ------------------------------- table ----------------------------- */

export type MockColumn = {
  label: string;
  align?: "left" | "right";
  /** e.g. 140 or "50%" — omitted columns absorb the remainder */
  width?: number | string;
};

/** DataExplorer-style table — 13px, zinc-400 headers over border-b
 *  zinc-800/30, rows border-b zinc-800/15 with soft hover, tabular numerics. */
export function MockTableGrid({ columns, rows }: { columns: MockColumn[]; rows: ReactNode[][] }) {
  return (
    <table className="w-full border-collapse">
      <thead className="border-b border-zinc-800/30">
        <tr>
          {columns.map((c) => (
            <th
              key={c.label}
              className={`px-5 py-2 text-[13px] font-normal text-zinc-400 whitespace-nowrap ${
                c.align === "right" ? "text-right" : "text-left"
              }`}
              style={c.width !== undefined ? { width: c.width } : undefined}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, i) => (
          <tr
            key={i}
            className="border-b border-zinc-800/15 last:border-0 text-zinc-500 text-[13px] hover:bg-white/[0.02] transition-colors"
          >
            {cells.map((cell, j) => (
              <td
                key={j}
                className={`px-5 py-2.5 whitespace-nowrap ${columns[j]?.align === "right" ? "text-right" : ""}`}
                style={TABULAR}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ------------------------------- chart ----------------------------- */

/** Line chart — the tell-web LineChart contract: indigo monotone line,
 *  horizontal dashed grid only, 10px muted ticks, no axis lines. Uses the
 *  clip-path reveal on an explicit-height container (the pattern that
 *  renders reliably — no vectorEffect + preserveAspectRatio combination). */
export function MockLine({
  data,
  unit,
  yTop,
  yMid,
}: {
  data: number[];
  unit: string;
  yTop: string;
  yMid: string;
}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${52 - ((v - min) / range) * 40}`)
    .join(" ");
  return (
    <div className="relative flex-1 min-h-[120px]">
      {/* Y labels */}
      <div
        className="absolute left-0 top-0 bottom-[16px] flex flex-col justify-between text-[10px] text-zinc-600 pr-2"
        style={TABULAR}
      >
        <span>{yTop}</span>
        <span>{yMid}</span>
        <span>0 {unit}</span>
      </div>
      <div className="absolute left-[44px] right-0 top-0 bottom-[16px]">
        {/* Horizontal dashed gridlines only, like the real LineChart */}
        {[0, 50, 100].map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-dashed border-zinc-800/30" style={{ top: `${t}%` }} />
        ))}
        <svg
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{
            clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transition: "clip-path 1.4s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
          }}
        >
          <polyline points={pts} fill="none" stroke={CHART_COLOR} strokeWidth="0.45" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      {/* X labels */}
      <div className="absolute left-[44px] right-0 bottom-0 flex justify-between text-[10px] text-zinc-600">
        <span>00:00</span>
        <span>08:00</span>
        <span>16:00</span>
        <span>Now</span>
      </div>
    </div>
  );
}

/* --------------------------- canvas nodes -------------------------- */

/** Brand area sparkline — the canvas MetricNode chart (stroke 1.5 + fade).
 *  `prior` draws a dashed low-opacity ghost line behind the current series,
 *  mirroring the real NodeCard's prior-period overlay. */
export function MockSparkArea({
  data,
  prior,
  id,
}: {
  data: number[];
  prior?: number[];
  id: string;
}) {
  const W = 100;
  const H = 30;
  // Share one y-domain across both series so the ghost line sits at the right
  // height relative to the current period.
  const all = prior ? [...data, ...prior] : data;
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const toPts = (series: number[]) =>
    series.map(
      (v, i) =>
        `${((i / (series.length - 1)) * W).toFixed(1)},${(H - 2 - ((v - min) / range) * (H - 6)).toFixed(1)}`,
    );
  const pts = toPts(data);
  const priorPts = prior && prior.length > 1 ? toPts(prior) : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND} stopOpacity="0.25" />
          <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill={`url(#${id})`} />
      {priorPts && (
        <polyline
          points={priorPts.join(" ")}
          fill="none"
          stroke="#71717a"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={BRAND}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Canvas delta chip — arrow icon + unsigned value on a tinted pill. */
export function MockDeltaChip({ delta, up }: { delta: string; up?: boolean | null }) {
  const tone =
    up === true
      ? "text-emerald-500 bg-emerald-500/10"
      : up === false
        ? "text-red-400 bg-red-400/10"
        : "text-zinc-500 bg-zinc-800/60";
  const path = up === true ? "M12 19V5M5 12l7-7 7 7" : up === false ? "M12 5v14M19 12l-7 7-7-7" : "M5 12h14";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${tone}`}
      style={TABULAR}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
      {delta}
    </span>
  );
}

/* --- KPI chrome: status pill, compare chips, owner, correlation pill --- */

/** Target/pacing status pill + optional 1px pacing bar — mirrors tell-web's
 *  KpiBadge (on-track/at-risk/off-track tones, fill follows status). */
export type MockStatus = "on_track" | "at_risk" | "off_track";

const STATUS_META: Record<MockStatus, { label: string; tone: string; bar: string }> = {
  on_track: { label: "On track", tone: "text-emerald-500 bg-emerald-500/10", bar: "bg-emerald-500" },
  at_risk: { label: "At risk", tone: "text-amber-500 bg-amber-500/10", bar: "bg-amber-500" },
  off_track: { label: "Off track", tone: "text-red-400 bg-red-400/10", bar: "bg-red-400" },
};

export function MockStatusPill({ status, progress }: { status: MockStatus; progress?: number }) {
  const meta = STATUS_META[status];
  const pct = progress != null ? Math.round(progress * 100) : null;
  const check =
    status === "on_track"
      ? "M20 6L9 17l-5-5"
      : "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z";
  return (
    <div className="mt-0.5 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-1.5">
        <span className={`inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${meta.tone}`}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={check} />
          </svg>
          {meta.label}
        </span>
        {pct != null && (
          <span className="text-[10px] font-medium text-zinc-500" style={TABULAR}>
            {pct}%
          </span>
        )}
      </div>
      {pct != null && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </div>
      )}
    </div>
  );
}

/** One labeled compare chip ("MoM +4.2%") — label above, signed % below. */
export type MockCompare = { kind: "WoW" | "MoM" | "YoY"; delta: string; up?: boolean | null };

export function MockCompareChip({ compare }: { compare: MockCompare }) {
  const { up, delta } = compare;
  const tone =
    up === true
      ? "text-emerald-500 bg-emerald-500/10"
      : up === false
        ? "text-red-400 bg-red-400/10"
        : "text-zinc-500 bg-zinc-800/60";
  const sign = up === true ? "+" : up === false ? "-" : "";
  return (
    <span className={`inline-flex flex-col items-center rounded-md px-1.5 py-0.5 leading-tight ${tone}`} style={TABULAR}>
      <span className="text-[8.5px] font-semibold uppercase tracking-wide opacity-80">{compare.kind}</span>
      <span className="text-[10px] font-medium">{sign}{delta}</span>
    </span>
  );
}

/** Owner initials chip — a small governance hint, only when an owner is set. */
export function MockOwnerChip({ owner }: { owner: string }) {
  const init = owner
    .replace(/^@/, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => (w[0] ?? "").toUpperCase())
    .join("");
  if (!init) return null;
  return (
    <span
      title={`Owner: ${owner}`}
      className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[8px] font-semibold text-brand"
    >
      {init}
    </span>
  );
}

/** Edge correlation pill — strength label on a driver edge. Strong = brand,
 *  moderate = neutral, weak = muted, mirroring tell-web's correlation tones. */
export type MockCorrStrength = "strong" | "moderate" | "weak";

const CORR_TONE: Record<MockCorrStrength, string> = {
  strong: "text-brand bg-brand/15 border-brand/30",
  moderate: "text-zinc-300 bg-zinc-800/80 border-zinc-700",
  weak: "text-zinc-500 bg-zinc-900/80 border-zinc-800",
};

const CORR_LABEL: Record<MockCorrStrength, string> = {
  strong: "Strong",
  moderate: "Moderate",
  weak: "Weak",
};

export function MockCorrelationPill({
  coefficient,
  strength,
}: {
  coefficient: string;
  strength: MockCorrStrength;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9.5px] font-medium shadow-sm ${CORR_TONE[strength]}`}
      style={TABULAR}
    >
      <span className="font-semibold">{coefficient}</span>
      <span className="opacity-80">{CORR_LABEL[strength]}</span>
    </span>
  );
}

/** Metric-tree node — the canvas NodeCard: title row (optional ƒ badge +
 *  owner chip), 2xl semibold value with delta chip, brand area sparkline
 *  (with optional prior-period ghost), and optional KPI status + compares. */
export function MockNodeCard({
  title,
  value,
  delta,
  up,
  spark,
  prior,
  sparkId,
  computed = false,
  status,
  progress,
  compares,
  owner,
  className = "",
  style,
}: {
  title: string;
  value: string;
  delta?: string;
  up?: boolean | null;
  spark?: number[];
  prior?: number[];
  sparkId?: string;
  computed?: boolean;
  status?: MockStatus;
  progress?: number;
  compares?: MockCompare[];
  owner?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const hasCompares = (compares?.length ?? 0) > 0;
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-xl border border-zinc-800 bg-[#151517] p-3 shadow-sm ${className}`}
      style={style}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {computed && (
          <span className="shrink-0 rounded bg-brand/15 px-1 text-[10px] font-semibold italic text-brand">ƒ</span>
        )}
        <span className="truncate text-xs font-medium text-zinc-500">{title}</span>
        {owner && <MockOwnerChip owner={owner} />}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold leading-none text-white" style={TABULAR}>
          {value}
        </span>
        {!hasCompares && delta && <MockDeltaChip delta={delta} up={up} />}
      </div>
      {spark && spark.length > 1 && (
        <div className="mt-1 h-9 w-full">
          <MockSparkArea data={spark} prior={prior} id={sparkId ?? `spark-${title.replace(/\W+/g, "-")}`} />
        </div>
      )}
      {hasCompares && (
        <div className="flex items-center gap-1">
          {compares!.map((c) => (
            <MockCompareChip key={c.kind} compare={c} />
          ))}
        </div>
      )}
      {status && <MockStatusPill status={status} progress={progress} />}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { getAllEntries } from "../content/changelog";

function DotGrid({ focusPoints }: { focusPoints: [number, number][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stableFocusPoints = useRef(focusPoints);

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const spacing = 18;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const maxDist = Math.sqrt(w * w + h * h) * 0.55;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;

        let maxInfluence = 0;
        for (const [fx, fy] of stableFocusPoints.current) {
          const dx = x - fx * w;
          const dy = y - fy * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / maxDist);
          if (influence > maxInfluence) maxInfluence = influence;
        }

        if (maxInfluence < 0.03) continue;

        // Slow diagonal sweep + per-dot shimmer
        const t = time * 0.0004;
        const sweep = Math.sin(t + (i + j) * 0.12) * 0.5 + 0.5;
        const shimmer = Math.sin(t * 3.7 + i * 1.3 + j * 2.1) * 0.5 + 0.5;
        const wave = sweep * 0.7 + shimmer * 0.3;

        const size = 2.5 * maxInfluence * (0.1 + wave * 0.9);
        const alpha = maxInfluence * (0.1 + wave * 0.65);

        if (size > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100,90,230,${alpha})`;
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement!;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const loop = (time: number) => {
      draw(canvas, ctx, time);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});

function AppShell() {
  const [agentOpen, setAgentOpen] = useState(true);

  return (
    <div className="w-full rounded-2xl bg-[#090a0b] p-3 text-[13px]">
      <div className="w-full h-[720px] rounded-xl bg-[#111113] overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[232px] shrink-0 flex flex-col" style={{ padding: "8px 14px 8px 8px" }}>
        {/* Brand + switcher */}
        <div className="px-2.5 h-[28px] flex items-center mb-3">
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
            {[
              { label: "Events", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { label: "Users", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
              { label: "Logs", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-md hover:bg-zinc-800/60 transition text-left"
                style={{ color: "rgb(208, 214, 224)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 opacity-60">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.label}
              </button>
            ))}
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
                  className="w-full px-2.5 py-[6px] rounded-md hover:bg-zinc-800/60 transition text-left"
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
                  className="w-full px-2.5 py-[6px] rounded-md hover:bg-zinc-800/60 transition text-left"
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
        <div className="flex-1 rounded-lg border border-zinc-800/40 bg-[#121314] flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="h-[48px] flex items-center justify-between pr-5 shrink-0" style={{ paddingLeft: "32px" }}>
            <div className="flex items-center gap-3">
              <span className="text-white font-medium text-[14px]">Growth</span>
              <div className="flex items-center">
                <button className="p-1 rounded-md hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                  { label: "MRR", value: "$48.2K", trend: "↑ 8%", up: true },
                  { label: "Trial → Paid", value: "12.4%", trend: "↑ 1.2%", up: true },
                  { label: "GitHub Stars", value: "3,847", trend: "↑ 234", up: true },
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
                      {[
                        { name: "Content viewed", count: "48,291", users: "8,412" },
                        { name: "Searched", count: "12,847", users: "4,891" },
                        { name: "Liked", count: "8,912", users: "3,247" },
                        { name: "Shared", count: "2,891", users: "1,634" },
                        { name: "Comment posted", count: "1,847", users: "892" },
                        { name: "User followed", count: "1,203", users: "634" },
                        { name: "Item purchased", count: "634", users: "487" },
                        { name: "Signed up", count: "312", users: "312" },
                      ].map((row) => (
                        <tr key={row.name} className="border-b border-zinc-800/30" style={{ height: "40px" }}>
                          <td className="text-zinc-300 pl-6">{row.name}</td>
                          <td className="text-right text-zinc-400" style={{ fontVariantNumeric: "tabular-nums" }}>{row.count}</td>
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
                  <p className="text-zinc-400"><span className="text-emerald-400">34</span> already converted to paid</p>
                  <p className="text-purple-400/80">Created board: HN signup cohort analysis</p>
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
        </div>
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
                  Funnels, retention, lifecycle analysis, and ML-powered segments
                  — unified with structured logs and a real-time pipeline.
                  Self-host in 5 minutes.
                </p>
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

      {/* Logo Bar — full container width */}
      <section className="py-8 px-6 border-t border-b border-zinc-800/40">
        <div className="max-w-[1340px] mx-auto flex items-center justify-between flex-wrap gap-y-4">
          {[
            { name: "Shopify", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
            { name: "JPMorgan", icon: "M4 4h16v16H4zM9 9h6v6H9z" },
            { name: "Coinbase", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 14a4 4 0 110-8 4 4 0 010 8z" },
            { name: "Square", icon: "M3 3h18v18H3zM8 8h8v8H8z" },
            { name: "Ramp", icon: "M2 17L12 7l10 10" },
            { name: "Vercel", icon: "M12 2L2 19h20L12 2z" },
            { name: "Notion", icon: "M4 4h10l6 6v10H4V4zm10 0v6h6" },
            { name: "GitHub", icon: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69C6.73 19.91 6.14 18 6.14 18c-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" },
          ].map(({ name, icon }, i) => (
            <div key={i} className="flex items-center gap-1.5 text-zinc-500">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d={icon} />
              </svg>
              <span className="text-[12px] font-semibold tracking-[0.06em] uppercase">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Intro — text inset */}
      <section className="py-28 md:py-36 px-6">
        <div className="max-w-[1340px] mx-auto md:px-8">
          <p className="text-[26px] md:text-[32px] leading-[1.4] tracking-[-0.015em]">
            <span className="text-white font-semibold">
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
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510 }}>
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
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510 }}>
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

      {/* Feature 3: Pipeline & plugins — 2-up mockups */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510 }}>
              Connect every signal
              <br />
              across your stack
            </h2>
            <p className="text-zinc-400 text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
              WASM plugin connectors pull data from GitHub, Shopify, Cloudflare,
              and Resend — crash-isolated, hot-loadable. Content-aware routing
              splits logs to ClickHouse, events to Parquet, everything to
              archive. One config.
            </p>
          </div>
          {/* Mockups — full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Shopify</span>
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">GitHub</span>
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Cloudflare</span>
                <span className="text-[11px] text-zinc-400">WASM plugins</span>
              </div>
              <div className="aspect-[4/3] rounded-xl border border-zinc-800/60 bg-[#111113]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">Routing</span>
                <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">PII redaction</span>
                <span className="text-[11px] text-zinc-400">10.9M events/sec</span>
              </div>
              <div className="aspect-[4/3] rounded-xl border border-zinc-800/60 bg-[#111113]" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: CLI & AI — full-width mockup */}
      <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
        <div className="max-w-[1340px] mx-auto">
          {/* Text — inset */}
          <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510 }}>
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
            <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510 }}>
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
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white mb-16" style={{ fontWeight: 510 }}>
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
        </div>
      </section>
    </div>
  );
}

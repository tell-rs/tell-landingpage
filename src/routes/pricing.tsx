import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { DotGrid } from "../components/dot-grid";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const cloudPlans = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: "",
    subtitle: "For individuals and side projects",
    description:
      "Funnels, retention, lifecycle, and logs — all included. 3 connectors, AI queries, and community support. Scale with usage-based pricing.",
    cta: "Get started",
    ctaLink: "/signup",
    popular: false,
    highlights: [
      "1M events included",
      "5 GB logs included",
      "Funnels, retention & lifecycle",
      "3 connectors",
      "10 AI queries/day",
      "Unlimited seats",
    ],
    overage: "$0.10/1K events, $0.25/GB logs",
  },
  {
    name: "Pro",
    price: { monthly: "$249", yearly: "$212" },
    period: "/mo",
    subtitle: "For startups and teams",
    description:
      "Everything in Free, plus unlimited connectors, anomaly detection, ML predictions, group analytics, and hourly refresh.",
    cta: "Start free trial",
    ctaLink: "/signup",
    popular: true,
    highlights: [
      "5M events included",
      "25 GB logs included",
      "Unlimited connectors",
      "Anomaly detection & ML",
      "90-day retention",
      "Unlimited AI queries",
    ],
    overage: "$0.05/1K events, $0.25/GB logs",
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    period: "",
    subtitle: "For scaling organizations",
    description:
      "Everything in Pro, plus SSO, audit logs, PII redaction, dedicated infrastructure, custom retention, and SLA.",
    cta: "Contact us",
    ctaLink: "mailto:hello@tell.rs",
    popular: false,
    highlights: [
      "Unlimited data",
      "Advanced analytics",
      "SAML / SCIM SSO",
      "Dedicated infrastructure",
      "Custom data residency",
      "Dedicated support + SLA",
    ],
  },
];

const selfHostedPlans = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: "",
    subtitle: "For individuals and side projects",
    description:
      "Full analytics, logs, and CLI. 3 connectors, Tell AI, community support.",
    cta: "Get started",
    ctaLink: "/download",
    popular: false,
    highlights: [
      "All analytics features",
      "All 6 SDKs",
      "Dashboard + CLI",
      "3 connectors",
      "10 AI queries/day",
      "1 workspace",
    ],
  },
  {
    name: "Pro",
    price: { monthly: "$249", yearly: "$212" },
    period: "/mo",
    subtitle: "For startups and teams",
    description:
      "Everything in Free, plus unlimited connectors, anomaly detection, native apps, Director, and OAuth SSO.",
    cta: "Start free trial",
    ctaLink: "/signup",
    popular: true,
    highlights: [
      "Unlimited connectors",
      "Unlimited AI queries",
      "Native apps",
      "Anomaly detection",
      "OAuth SSO + RBAC",
      "3 workspaces",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    period: "",
    subtitle: "For scaling organizations",
    description:
      "Everything in Pro, plus SAML/SCIM, audit logs, compliance reports, and unlimited workspaces.",
    cta: "Contact us",
    ctaLink: "mailto:hello@tell.rs",
    popular: false,
    highlights: [
      "SAML / SCIM SSO",
      "Audit logs",
      "Compliance reports",
      "Unlimited workspaces",
      "Syslog + Modbus ingestion",
      "Dedicated support + SLA",
    ],
  },
];

type CompareRow = {
  feature: string;
  free: string;
  pro: string;
  enterprise: string;
};

type CompareSection = {
  category: string;
  rows: CompareRow[];
};

const cloudCompare: CompareSection[] = [
  {
    category: "Usage",
    rows: [
      { feature: "Monthly events", free: "1M included", pro: "5M included", enterprise: "Negotiated" },
      { feature: "Monthly logs", free: "5 GB included", pro: "25 GB included", enterprise: "Negotiated" },
      { feature: "Event overage", free: "$0.10/1K", pro: "$0.05/1K", enterprise: "Committed pricing" },
      { feature: "Log overage", free: "$0.25/GB", pro: "$0.25/GB", enterprise: "Committed pricing" },
      { feature: "Seats", free: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
      { feature: "Retention", free: "30 days", pro: "90 days", enterprise: "Custom" },
      { feature: "Data refresh", free: "Daily", pro: "Hourly", enterprise: "Real-time" },
    ],
  },
  {
    category: "Analytics",
    rows: [
      { feature: "Insights, funnels, retention & lifecycle", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Segments & audiences", free: "Basic", pro: "Full", enterprise: "Full" },
      { feature: "Breakdowns, filtering & comparisons", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Group analytics (company-level)", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Formulas & saved metrics", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Anomaly detection", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "ML predictions (churn, scoring)", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Revenue analytics", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "AI queries", free: "10/day", pro: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    category: "Data management",
    rows: [
      { feature: "Connectors (GitHub, Shopify, etc.)", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
      { feature: "SDKs (Rust, TS, Go, Swift, Flutter, C++)", free: "All 6", pro: "All 6", enterprise: "All 6" },
      { feature: "API access", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Data export", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Historical data migration", free: "\u2014", pro: "\u2014", enterprise: "Included" },
      { feature: "Data residency", free: "EU", pro: "EU", enterprise: "Choose region" },
      { feature: "Dedicated infrastructure", free: "\u2014", pro: "\u2014", enterprise: "Available" },
    ],
  },
  {
    category: "Collaboration",
    rows: [
      { feature: "Dashboards", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
      { feature: "Canvases", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Sharing (boards & metrics)", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Workspaces", free: "1", pro: "3", enterprise: "Unlimited" },
    ],
  },
  {
    category: "Governance & security",
    rows: [
      { feature: "GDPR & CCPA compliant", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Cookieless tracking", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "2FA", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "RBAC", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "PII auto-redaction", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
      { feature: "SSO", free: "\u2014", pro: "\u2014", enterprise: "SAML / SCIM" },
      { feature: "Audit logs", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
    ],
  },
  {
    category: "Support & services",
    rows: [
      { feature: "Community (Discord, GitHub)", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Email support", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Priority support + response SLA", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
      { feature: "Dedicated account manager", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
      { feature: "Onboarding", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
      { feature: "Uptime SLA", free: "\u2014", pro: "\u2014", enterprise: "99.9%" },
      { feature: "Custom terms & contracts", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
    ],
  },
];

const selfHostedCompare: CompareSection[] = [
  {
    category: "Platform",
    rows: [
      { feature: "Analytics", free: "All", pro: "All", enterprise: "All" },
      { feature: "SDKs", free: "All 6", pro: "All 6", enterprise: "All 6" },
      { feature: "Dashboard + CLI", free: "\u2713", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Ingestion", free: "HTTP, TCP", pro: "+ Syslog", enterprise: "+ Modbus" },
      { feature: "Workspaces", free: "1", pro: "3", enterprise: "Unlimited" },
    ],
  },
  {
    category: "Analytics",
    rows: [
      { feature: "Connectors", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
      { feature: "AI queries", free: "10/day", pro: "Unlimited", enterprise: "Unlimited" },
      { feature: "Anomaly detection", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Native apps", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Director", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
    ],
  },
  {
    category: "Security & compliance",
    rows: [
      { feature: "SSO", free: "\u2014", pro: "OAuth", enterprise: "SAML / SCIM" },
      { feature: "RBAC", free: "\u2014", pro: "\u2713", enterprise: "\u2713" },
      { feature: "Audit logs", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
      { feature: "Compliance reports", free: "\u2014", pro: "\u2014", enterprise: "\u2713" },
    ],
  },
  {
    category: "Support",
    rows: [
      { feature: "Support", free: "Community", pro: "Email", enterprise: "Dedicated + SLA" },
    ],
  },
];

function Check() {
  return (
    <svg className="w-4 h-4 text-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CellValue({ value }: { value: string }) {
  if (value === "\u2713") return <Check />;
  if (value === "\u2014") return <span className="text-zinc-700">{value}</span>;
  return <span className="text-zinc-300">{value}</span>;
}

function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [mode, setMode] = useState<"cloud" | "self-hosted">("cloud");

  const plans = mode === "cloud" ? cloudPlans : selfHostedPlans;
  const compare = mode === "cloud" ? cloudCompare : selfHostedCompare;

  return (
    <div className="min-h-screen">
      {/* Hero — tight, just title */}
      <div className="pt-36 md:pt-44 pb-14 px-6 text-center">
        <div className="max-w-[1340px] mx-auto md:px-8">
          <h1 className="text-[48px] md:text-[76px] leading-[1.05] font-semibold tracking-[-0.035em] text-white">
            Plans that scale with you
          </h1>
        </div>
      </div>

      {/* Plan cards */}
      <div className="px-6 pb-32">
        {/* Controls — subtle, right above cards */}
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between mb-8">
          {/* Mode toggle */}
          <div className="inline-flex items-center rounded-full border border-zinc-800 p-1">
            <button
              onClick={() => setMode("cloud")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                mode === "cloud"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Cloud
            </button>
            <button
              onClick={() => setMode("self-hosted")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                mode === "self-hosted"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Self-hosted
            </button>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <span
              onClick={() => setBilling("monthly")}
              className={`text-[13px] cursor-pointer transition-colors ${
                billing === "monthly" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                billing === "yearly" ? "bg-brand" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-sm ${
                  billing === "yearly" ? "translate-x-[14px]" : "translate-x-0"
                }`}
              />
            </button>
            <span
              onClick={() => setBilling("yearly")}
              className={`text-[13px] cursor-pointer transition-colors ${
                billing === "yearly" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Yearly
              <span className="ml-1 text-brand text-[11px] font-medium">-15%</span>
            </span>
          </div>
        </div>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:items-end">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border ${
                  plan.popular
                    ? "border-brand/30 bg-white/[0.03]"
                    : "border-zinc-800/50"
                }`}
              >
                {/* Popular indicator — top edge glow */}
                {plan.popular && (
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
                )}

                <div className={`p-8 flex flex-col flex-1 ${plan.popular ? "md:p-10 md:py-12" : "md:p-10"}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-white">{plan.name}</h3>
                      <p className="text-[15px] text-zinc-500 mt-1">{plan.subtitle}</p>
                    </div>
                    {plan.popular && (
                      <span className="text-[13px] font-medium text-brand bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[48px] font-semibold tracking-[-0.03em] text-white leading-none">
                        {plan.price[billing]}
                      </span>
                      {plan.period && (
                        <span className="text-[17px] text-zinc-500">{plan.period}</span>
                      )}
                    </div>
                    <p className={`text-[13px] text-zinc-600 mt-2 ${
                      billing === "yearly" && plan.price.yearly !== "$0" && plan.price.yearly !== "Custom"
                        ? "visible" : "invisible"
                    }`}>billed annually</p>
                  </div>

                  {/* Description */}
                  <p className="text-[15px] text-zinc-400 leading-relaxed mb-8 md:min-h-[72px]">
                    {plan.description}
                  </p>

                  {/* Key highlights — top 3 only */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.highlights.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[15px] text-zinc-400">
                        <Check />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to={plan.ctaLink}
                    className={`block w-full text-center py-3 rounded-lg text-[15px] font-medium transition-colors ${
                      plan.popular
                        ? "bg-white text-zinc-900 hover:bg-zinc-200"
                        : "bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] hover:text-white border border-zinc-800/60"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price calculator — Cloud Pro only */}
      {mode === "cloud" && <PriceCalculator billing={billing} />}

      {/* Compare plans */}
      <div className="px-6 pb-32">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white mb-16 text-center" style={{ fontWeight: 510 }}>
            Compare plans
          </h2>

          {/* Sticky table header */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr] sticky top-14 z-10 bg-background/95 backdrop-blur-sm border-b border-zinc-800/60 pb-4 pt-4 -mx-1 px-1">
            <div />
            {plans.map((plan) => (
              <div key={plan.name} className="text-center">
                <span className={`text-[15px] font-semibold ${plan.popular ? "text-brand" : "text-white"}`}>
                  {plan.name}
                </span>
              </div>
            ))}
          </div>

          {/* Sections */}
          {compare.map((section) => (
            <div key={section.category}>
              <div className="pt-10 pb-4 border-b border-zinc-800/40">
                <span className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {section.category}
                </span>
              </div>
              {section.rows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] py-4 border-b border-zinc-800/20 group hover:bg-white/[0.01] transition-colors"
                >
                  <div className="text-[15px] text-zinc-300 flex items-center">{row.feature}</div>
                  <div className="text-center flex items-center justify-center hidden md:flex">
                    <CellValue value={row.free} />
                  </div>
                  <div className="text-center flex items-center justify-center hidden md:flex">
                    <CellValue value={row.pro} />
                  </div>
                  <div className="text-center flex items-center justify-center hidden md:flex">
                    <CellValue value={row.enterprise} />
                  </div>
                  {/* Mobile */}
                  <div className="md:hidden mt-2 flex gap-6 text-[13px]">
                    <span className="text-zinc-600">Free: <CellValue value={row.free} /></span>
                    <span className="text-zinc-600">Pro: <CellValue value={row.pro} /></span>
                    <span className="text-zinc-600">Ent: <CellValue value={row.enterprise} /></span>
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>

      {/* FAQ */}
      <div className="px-6 pb-32">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white mb-16 text-center" style={{ fontWeight: 510 }}>
            Questions
          </h2>

          <div className="max-w-[1100px] mx-auto divide-y divide-zinc-800/50">
            <FaqItem
              question="Is the Free plan actually free?"
              answer="Yes, fully free with no time limit and no credit card required. On Cloud, you get 1M events and 5 GB logs included per month. Go beyond that and you pay usage-based overages at $0.10 per 1K events and $0.25 per GB of logs — no hard cutoff. On Self-hosted, there are no usage caps — you run your own infrastructure — but you're limited to 1 workspace, 3 connectors, and 10 AI queries per day."
            />
            <FaqItem
              question="What happens if I exceed my limits on Cloud?"
              answer="On Cloud Free, overages are billed at $0.10 per 1K events and $0.25 per GB of logs — your data never stops flowing. On Cloud Pro, event overages drop to $0.05 per 1K (logs stay $0.25/GB). You can set spending caps in your dashboard to avoid surprises. Self-hosted plans have no usage caps since you provide your own storage and compute."
            />
            <FaqItem
              question="Can I get support on the Free plan?"
              answer="Free includes community support through GitHub Discussions and Discord on both Cloud and Self-hosted. For email support with guaranteed response times, upgrade to Pro. Enterprise customers get a dedicated support contact with SLA."
            />
            <FaqItem
              question="How does the free trial work?"
              answer="Pro comes with a 14-day free trial, no credit card upfront. You get full access to all Pro features — unlimited connectors, anomaly detection, and extended AI on Cloud, plus native apps, Director, and OAuth SSO on Self-hosted. If you don't convert, your workspace downgrades to Free automatically — no data is lost."
            />
            <FaqItem
              question="What's the difference between Cloud Pro and Self-hosted Pro?"
              answer="Same price, different tradeoffs. Cloud Pro includes 5M events and 25 GB logs with hourly refresh and half-rate overages — we handle the infrastructure. Self-hosted Pro has no usage caps, unlimited AI queries, native desktop apps, the Director orchestration layer, OAuth SSO, and RBAC — but you manage your own servers and storage."
            />
            <FaqItem
              question="Can I switch between Cloud and Self-hosted?"
              answer="Yes. The same binary powers both. You can export your data from Cloud and import it into a self-hosted instance, or vice versa. Your configuration, dashboards, and saved queries transfer as-is."
            />
            <FaqItem
              question="Do you offer annual billing?"
              answer="Yes, save 15% by paying annually on both Cloud and Self-hosted. Pro is $212/mo billed yearly instead of $249/mo monthly. Toggle to yearly billing above to see adjusted pricing."
            />
            <FaqItem
              question="What's the Startup Program?"
              answer="Early-stage startups get the full Pro plan free for 12 months — Cloud or Self-hosted, your choice. Eligibility: founded less than 3 years ago, raised less than $5M. After the first year, you continue on Pro at $249/mo. Apply by emailing us."
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-32 md:py-44 px-6 relative overflow-hidden">
        <DotGrid focusPoints={[[0.5, 0.5]]} />
        <div className="max-w-[1340px] mx-auto text-center relative">
          <h2 className="text-[42px] md:text-[58px] font-semibold tracking-[-0.035em] text-white leading-[1.08] mb-10">
            Start building today.
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-zinc-100 text-zinc-900 text-[15px] font-medium rounded-lg hover:bg-white transition"
            >
              Get Started
            </Link>
            <a
              href="mailto:hello@tell.rs"
              className="px-5 py-2.5 text-[15px] font-medium text-zinc-400 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-zinc-200 transition"
            >
              Contact
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const EVENT_STEPS = [1, 1.5, 2, 3, 4, 5, 7, 10, 15, 20, 30, 50, 75, 100];
const LOG_STEPS = [1, 2, 5, 10, 15, 25, 50, 75, 100, 150, 200, 300, 400, 500];

function StepSlider({
  steps,
  value,
  onChange,
  format,
  label,
}: {
  steps: number[];
  value: number;
  onChange: (idx: number) => void;
  format: (v: number) => string;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const idx = Math.round(pct * (steps.length - 1));
      onChange(idx);
    },
    [steps, onChange],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      handleInteraction(e.clientX);
    },
    [handleInteraction],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons === 0) return;
      handleInteraction(e.clientX);
    },
    [handleInteraction],
  );

  const pct = (value / (steps.length - 1)) * 100;

  return (
    <div>
      <div
        ref={trackRef}
        className="relative h-6 flex items-center cursor-pointer select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        {/* Track */}
        <div className="absolute left-0 right-0 h-[2px] bg-zinc-800" />
        <div className="absolute left-0 h-[2px] bg-brand" style={{ width: `${pct}%` }} />
        {/* Dots */}
        {steps.map((_, i) => {
          const x = (i / (steps.length - 1)) * 100;
          return (
            <div
              key={i}
              className={`absolute w-[6px] h-[6px] rounded-full -translate-x-1/2 ${
                i <= value ? "bg-brand" : "bg-zinc-700"
              }`}
              style={{ left: `${x}%` }}
            />
          );
        })}
        {/* Thumb */}
        <div
          className="absolute w-5 h-5 rounded-full bg-brand border-[3px] border-background -translate-x-1/2 shadow-[0_0_8px_rgba(100,90,230,0.4)] transition-[left] duration-75"
          style={{ left: `${pct}%` }}
        />
      </div>
      {/* Labels */}
      <div className="relative h-4 mt-2">
        {steps.map((step, i) => {
          const x = (i / (steps.length - 1)) * 100;
          return (
            <span
              key={i}
              className={`absolute -translate-x-1/2 text-[11px] whitespace-nowrap ${
                i === value ? "text-white font-semibold" : "text-zinc-600"
              }`}
              style={{ left: `${x}%` }}
            >
              {format(step)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function PriceCalculator({ billing }: { billing: "monthly" | "yearly" }) {
  const [eventIdx, setEventIdx] = useState(0);
  const [logIdx, setLogIdx] = useState(0);

  const eventsM = EVENT_STEPS[eventIdx];
  const logsGB = LOG_STEPS[logIdx];

  // Free path: $0 base, overages at $0.10/1K events + $0.25/GB
  const freeEventOverage = Math.max(0, eventsM - 1) * 1_000_000 / 1000 * 0.10;
  const freeLogOverage = Math.max(0, logsGB - 5) * 0.25;
  const freeTotal = freeEventOverage + freeLogOverage;

  // Pro path: $249/$212 base, 5M included, overages at $0.05/1K + $0.25/GB
  const proBase = billing === "yearly" ? 212 : 249;
  const proEventOverage = Math.max(0, eventsM - 5) * 1_000_000 / 1000 * 0.05;
  const proLogOverage = Math.max(0, logsGB - 25) * 0.25;
  const proTotal = proBase + proEventOverage + proLogOverage;

  const proIsCheaper = proTotal <= freeTotal;
  const total = proIsCheaper ? proTotal : freeTotal;
  const plan = proIsCheaper ? "Pro" : "Free";

  return (
    <div className="px-6 pb-32">
      <div className="max-w-[1100px] mx-auto">
        {/* Header row: title left, price right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-white" style={{ fontWeight: 510 }}>
            Estimate your cost
          </h2>
          <div className="flex items-baseline gap-2 mt-4 md:mt-0">
            <span className="text-[48px] font-semibold tracking-[-0.03em] text-white leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
              ${Math.round(total).toLocaleString()}
            </span>
            <span className="text-[17px] text-zinc-500">/mo</span>
          </div>
        </div>

        {/* Sliders */}
        <div>
          <p className="text-[13px] text-zinc-500 mb-3">Event volume</p>
          <StepSlider
            steps={EVENT_STEPS}
            value={eventIdx}
            onChange={setEventIdx}
            format={(v) => `${v}M`}
          />

          <p className="text-[13px] text-zinc-500 mb-3 mt-8">Log volume</p>
          <StepSlider
            steps={LOG_STEPS}
            value={logIdx}
            onChange={setLogIdx}
            format={(v) => `${v} GB`}
          />
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  return (
    <div className="py-6">
      <button
        onClick={toggle}
        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group"
      >
        <span className="text-[17px] text-white font-medium leading-snug group-hover:text-zinc-300 transition-colors">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-zinc-500 shrink-0 mt-0.5 transition-transform ${open ? "rotate-45" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-[15px] text-zinc-400 leading-relaxed pr-10">
          {answer}
        </p>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { DotGrid } from "../components/dot-grid";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

type Plan = {
  name: string;
  price: { monthly: string; yearly: string };
  period: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
  /** Self-serve tier: CTA goes through the Stripe checkout path (/upgrade). */
  selfServe?: boolean;
  popular: boolean;
  highlights: string[];
  overage?: string;
};

const cloudPlans: Plan[] = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: "",
    subtitle: "Start in 2 minutes, zero setup",
    description:
      "We run the infrastructure. 2M events a month, free forever — logs count as events, spending caps on by default. No credit card required.",
    cta: "Get started",
    ctaLink: "/signup",
    popular: false,
    highlights: [
      "2M events included — logs count as events",
      "Spending cap on by default",
      "1-year retention",
      "Funnels, retention & lifecycle",
      "3 connectors",
      "10 AI queries/day",
      "Unlimited seats",
    ],
    overage: "Opt-in overage: $0.10/1K events",
  },
  {
    name: "Pro",
    price: { monthly: "$99", yearly: "$84" },
    period: "/mo",
    subtitle: "For growing teams",
    description:
      "10M events included — Mixpanel charges ~$2,520/mo for the same volume. Anomaly detection, ML, unlimited AI and connectors, Metrics Mesh (early access). One meter, no surprise line items.",
    cta: "Get Pro",
    ctaLink: "/upgrade",
    selfServe: true,
    popular: true,
    highlights: [
      "10M events included",
      "3-year retention",
      "Anomaly detection & ML",
      "Unlimited connectors",
      "Unlimited AI queries",
      "Metrics Mesh (early access)",
    ],
    overage: "Overage: $0.03/1K events",
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    period: "",
    subtitle: "Managed, dedicated, compliant",
    description:
      "Everything in Pro on dedicated infrastructure — SSO, audit logs, PII redaction, custom data residency, and SLA.",
    cta: "Contact us",
    ctaLink: "mailto:hello@tell.rs",
    popular: false,
    highlights: [
      "Unlimited data",
      "Custom retention",
      "PII auto-redaction",
      "SAML / SCIM SSO",
      "Dedicated infrastructure",
      "Dedicated support + SLA",
    ],
  },
];

const selfHostedPlans: Plan[] = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: "",
    subtitle: "Your servers, your data",
    description:
      "Full analytics, logs, and CLI — no usage caps, no data leaving your infrastructure. One binary, built in Rust. Free for anyone, forever.",
    cta: "Download",
    ctaLink: "/download",
    popular: false,
    highlights: [
      "No usage caps",
      "Full analytics engine",
      "All 6 SDKs",
      "3 connectors",
      "10 AI queries/day",
      "1 workspace",
    ],
  },
  {
    name: "Pro",
    price: { monthly: "$99", yearly: "$84" },
    period: "/mo",
    subtitle: "Companies under 100 employees",
    description:
      "Flat price. Unlimited data, unlimited seats — humans and AI agents. OAuth SSO, anomaly detection, Metrics Mesh (early access), and native apps on your infrastructure.",
    cta: "Get Pro",
    ctaLink: "/upgrade",
    selfServe: true,
    popular: true,
    highlights: [
      "Unlimited connectors",
      "OAuth SSO",
      "Anomaly detection & ML",
      "Native apps + Director",
      "Metrics Mesh (early access)",
      "Offline license — no check-in",
    ],
  },
  {
    name: "Business",
    price: { monthly: "$349", yearly: "$297" },
    period: "/mo",
    subtitle: "Companies under 1,000 employees",
    description:
      "Everything in Pro for growing companies — unlimited workspaces and priority support. Same flat-price logic: no meters on your own hardware.",
    cta: "Contact us",
    ctaLink: "mailto:hello@tell.rs?subject=Tell%20Self-hosted%20Business",
    popular: false,
    highlights: [
      "Everything in Pro",
      "Unlimited workspaces",
      "Priority email support",
      "Flat price — no meters",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    period: "",
    subtitle: "Regulated, air-gapped, supported",
    description:
      "From $24k/year. SAML/SCIM, audit logs, compliance reports, air-gap installs, and dedicated support with SLA — the tier that unblocks procurement.",
    cta: "Contact us",
    ctaLink: "mailto:hello@tell.rs",
    popular: false,
    highlights: [
      "SAML / SCIM SSO",
      "Audit logs",
      "Compliance reports",
      "Air-gap install kit",
      "Syslog + Modbus ingestion",
      "Dedicated support + SLA",
    ],
  },
];

type CompareRow = {
  feature: string;
  /** One value per plan, in plan order. */
  values: string[];
};

type CompareSection = {
  category: string;
  rows: CompareRow[];
};

const cloudCompare: CompareSection[] = [
  {
    category: "Usage — one meter",
    rows: [
      { feature: "Monthly events", values: ["2M included", "10M included", "Unlimited"] },
      { feature: "Log lines", values: ["Count as events", "Count as events", "Count as events"] },
      { feature: "Event overage", values: ["Opt-in, $0.10/1K", "$0.03/1K", "Volume pricing"] },
      { feature: "Spending cap", values: ["On by default", "Configurable", "Configurable"] },
      { feature: "Seats (humans & AI agents)", values: ["Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Retention", values: ["1 year", "3 years", "Custom"] },
    ],
  },
  {
    category: "Analytics",
    rows: [
      { feature: "Insights, funnels, retention & lifecycle", values: ["✓", "✓", "✓"] },
      { feature: "Segments & audiences", values: ["✓", "✓", "✓"] },
      { feature: "Breakdowns, filtering & comparisons", values: ["✓", "✓", "✓"] },
      { feature: "Group analytics (company-level)", values: ["✓", "✓", "✓"] },
      { feature: "Formulas & saved metrics", values: ["✓", "✓", "✓"] },
      { feature: "Revenue analytics", values: ["✓", "✓", "✓"] },
      { feature: "Anomaly detection", values: ["—", "✓", "✓"] },
      { feature: "ML predictions (churn, scoring)", values: ["—", "✓", "✓"] },
      { feature: "Issues & error clustering", values: ["—", "✓", "✓"] },
      { feature: "Alerts, digests & channels", values: ["—", "✓", "✓"] },
      { feature: "Audience sync (ad platforms)", values: ["—", "✓", "✓"] },
      { feature: "AI queries", values: ["10/day", "Unlimited", "Unlimited"] },
      { feature: "MCP server (bring your AI agents)", values: ["—", "✓", "✓"] },
    ],
  },
  {
    category: "Data management",
    rows: [
      { feature: "Connectors (GitHub, Stripe, Shopify, etc.)", values: ["3", "Unlimited", "Unlimited"] },
      { feature: "Metrics Mesh — query Postgres, ClickHouse & lakes in place", values: ["—", "Early access", "Early access"] },
      { feature: "SDKs (Rust, TS, Go, Swift, Flutter, C++)", values: ["All 6", "All 6", "All 6"] },
      { feature: "API access", values: ["✓", "✓", "✓"] },
      { feature: "Data export", values: ["✓", "✓", "✓"] },
      { feature: "Historical data migration", values: ["—", "—", "Included"] },
      { feature: "Data residency", values: ["EU", "EU", "Choose region"] },
      { feature: "Dedicated infrastructure", values: ["—", "—", "Available"] },
    ],
  },
  {
    category: "Collaboration",
    rows: [
      { feature: "Dashboards", values: ["Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Canvases (metric trees)", values: ["✓", "✓", "✓"] },
      { feature: "AI metric-tree builder", values: ["—", "✓", "✓"] },
      { feature: "Metric tree time travel & KPI history", values: ["—", "✓", "✓"] },
      { feature: "Target-breach alerts", values: ["—", "✓", "✓"] },
      { feature: "Sharing (boards & metrics)", values: ["✓", "✓", "✓"] },
      { feature: "Workspaces", values: ["1", "3", "Unlimited"] },
    ],
  },
  {
    category: "Governance & security",
    rows: [
      { feature: "GDPR & CCPA compliant", values: ["✓", "✓", "✓"] },
      { feature: "Cookieless tracking", values: ["✓", "✓", "✓"] },
      { feature: "2FA", values: ["✓", "✓", "✓"] },
      { feature: "RBAC", values: ["✓", "✓", "✓"] },
      { feature: "PII auto-redaction", values: ["—", "—", "✓"] },
      { feature: "SSO", values: ["—", "—", "SAML / SCIM"] },
      { feature: "Audit logs", values: ["—", "—", "✓"] },
    ],
  },
  {
    category: "Support & services",
    rows: [
      { feature: "Community (Discord, GitHub)", values: ["✓", "✓", "✓"] },
      { feature: "Email support", values: ["—", "✓", "✓"] },
      { feature: "Priority support + response SLA", values: ["—", "—", "✓"] },
      { feature: "Dedicated account manager", values: ["—", "—", "✓"] },
      { feature: "Onboarding", values: ["—", "—", "✓"] },
      { feature: "Uptime SLA", values: ["—", "—", "99.9%"] },
      { feature: "Custom terms & contracts", values: ["—", "—", "✓"] },
    ],
  },
];

const selfHostedCompare: CompareSection[] = [
  {
    category: "Platform",
    rows: [
      { feature: "Licensed for", values: ["Anyone, forever", "< 100 employees", "< 1,000 employees", "Any size"] },
      { feature: "Data caps", values: ["None", "None", "None", "None"] },
      { feature: "Seats (humans & AI agents)", values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Analytics", values: ["All", "All", "All", "All"] },
      { feature: "SDKs", values: ["All 6", "All 6", "All 6", "All 6"] },
      { feature: "Dashboard + CLI", values: ["✓", "✓", "✓", "✓"] },
      { feature: "Ingestion", values: ["HTTP, TCP", "+ Syslog", "+ Syslog", "+ Modbus"] },
      { feature: "Workspaces", values: ["1", "3", "Unlimited", "Unlimited"] },
    ],
  },
  {
    category: "Features",
    rows: [
      { feature: "Connectors", values: ["3", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "AI queries", values: ["10/day", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Canvases (metric trees)", values: ["✓", "✓", "✓", "✓"] },
      { feature: "AI metric-tree builder", values: ["—", "✓", "✓", "✓"] },
      { feature: "Metric tree time travel & KPI history", values: ["—", "✓", "✓", "✓"] },
      { feature: "Target-breach alerts", values: ["—", "✓", "✓", "✓"] },
      { feature: "Anomaly detection & ML", values: ["—", "✓", "✓", "✓"] },
      { feature: "Native apps + Director", values: ["—", "✓", "✓", "✓"] },
      { feature: "Metrics Mesh — query Postgres, ClickHouse & lakes in place", values: ["—", "Early access", "Early access", "Early access"] },
    ],
  },
  {
    category: "License & privacy",
    rows: [
      { feature: "License check", values: ["No license needed", "Offline file", "Offline file", "Offline + air-gap kit"] },
      { feature: "License check-in", values: ["None", "None", "None", "None"] },
      { feature: "Company-size band", values: ["—", "Self-certified", "Self-certified", "Contract"] },
    ],
  },
  {
    category: "Security & compliance",
    rows: [
      { feature: "SSO", values: ["—", "OAuth", "OAuth", "SAML / SCIM"] },
      { feature: "RBAC", values: ["✓", "✓", "✓", "✓"] },
      { feature: "Audit logs", values: ["—", "—", "—", "✓"] },
      { feature: "Compliance reports", values: ["—", "—", "—", "✓"] },
    ],
  },
  {
    category: "Support",
    rows: [
      { feature: "Support", values: ["Community", "Email", "Priority email", "Dedicated + SLA"] },
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
  if (value === "✓") return <Check />;
  if (value === "—") return <span className="text-faint">{value}</span>;
  return <span className="text-strong">{value}</span>;
}

function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [mode, setMode] = useState<"cloud" | "self-hosted">("cloud");

  const plans = mode === "cloud" ? cloudPlans : selfHostedPlans;
  const compare = mode === "cloud" ? cloudCompare : selfHostedCompare;
  const isSelfHosted = mode === "self-hosted";

  const cardsGridCls = isSelfHosted
    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:items-end"
    : "grid grid-cols-1 md:grid-cols-3 gap-5 md:items-end";
  const compareGridCls = isSelfHosted
    ? "md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]"
    : "md:grid-cols-[1.3fr_1fr_1fr_1fr]";

  return (
    <div className="min-h-screen">
      {/* Hero — tight, just title */}
      <div className="pt-36 md:pt-44 pb-14 px-6 text-center">
        <div className="max-w-[1340px] mx-auto md:px-8">
          <h1 className="text-[48px] md:text-[76px] leading-[1.05] font-semibold tracking-[-0.035em] text-foreground">
            Plans that scale with you
          </h1>
          <p className="text-[17px] md:text-[19px] text-muted-foreground mt-5 max-w-[640px] mx-auto leading-relaxed">
            {isSelfHosted
              ? "The production-grade, supported, single-binary self-host that nobody else will sell you. Free and uncapped for anyone — flat prices above."
              : "Product analytics, logs, revenue, and your channels — one platform, one bill. Free forever, or Pro at $99/mo."}
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="px-6 pb-32">
        {/* Controls — subtle, right above cards */}
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between mb-8">
          {/* Mode toggle */}
          <div className="inline-flex items-center rounded-full border border-border p-1">
            <button
              onClick={() => setMode("cloud")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                mode === "cloud"
                  ? "bg-pill-bg text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-strong"
              }`}
            >
              Cloud
            </button>
            <button
              onClick={() => setMode("self-hosted")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                mode === "self-hosted"
                  ? "bg-pill-bg text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-strong"
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
                billing === "monthly" ? "text-foreground" : "text-muted-foreground hover:text-strong"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                billing === "yearly" ? "bg-brand" : "bg-track"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 rounded-full bg-contrast transition-transform shadow-sm ${
                  billing === "yearly" ? "translate-x-[14px]" : "translate-x-0"
                }`}
              />
            </button>
            <span
              onClick={() => setBilling("yearly")}
              className={`text-[13px] cursor-pointer transition-colors ${
                billing === "yearly" ? "text-foreground" : "text-muted-foreground hover:text-strong"
              }`}
            >
              Yearly
              <span className="ml-1 text-brand text-[11px] font-medium">-15%</span>
            </span>
          </div>
        </div>
        <div className="max-w-[1100px] mx-auto">
          <div className={cardsGridCls}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border ${
                  plan.popular
                    ? "border-brand/30 bg-elevated"
                    : "border-border/50"
                }`}
              >
                {/* Popular indicator — top edge glow */}
                {plan.popular && (
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
                )}

                <div className={`flex flex-col flex-1 ${isSelfHosted ? "p-7" : plan.popular ? "p-8 md:p-10 md:py-12" : "p-8 md:p-10"}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-foreground">{plan.name}</h3>
                      <p className="text-[14px] text-muted-foreground mt-1">{plan.subtitle}</p>
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
                      <span className="text-[44px] font-semibold tracking-[-0.03em] text-foreground leading-none">
                        {plan.price[billing]}
                      </span>
                      {plan.period && (
                        <span className="text-[17px] text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className={`text-[13px] mt-2 ${
                      billing === "yearly" && plan.price.yearly !== "$0" && plan.price.yearly !== "Custom"
                        ? "text-faint visible"
                        : plan.popular
                          ? "text-faint visible"
                          : "invisible"
                    }`}>{
                      billing === "yearly" && plan.price.yearly !== "$0" && plan.price.yearly !== "Custom"
                        ? "billed annually"
                        : plan.popular
                          ? "Start on Free, upgrade anytime"
                          : " "
                    }</p>
                  </div>

                  {/* Description */}
                  <p className={`text-[14px] text-muted leading-relaxed mb-8 ${isSelfHosted ? "md:min-h-[110px]" : "md:min-h-[88px]"}`}>
                    {plan.description}
                  </p>

                  {/* Key highlights — top 3 only */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.highlights.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] text-muted">
                        <Check />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.selfServe ? (
                    <Link
                      to="/upgrade"
                      search={{ tier: billing === "yearly" ? "pro-yearly" : "pro" }}
                      className={`block w-full text-center py-3 rounded-lg text-[15px] font-medium transition-colors ${
                        plan.popular
                          ? "bg-contrast text-contrast-fg hover:bg-contrast-hover"
                          : "bg-foreground/[0.06] text-strong hover:bg-foreground/[0.1] hover:text-foreground border border-border/60"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <Link
                      to={plan.ctaLink}
                      className={`block w-full text-center py-3 rounded-lg text-[15px] font-medium transition-colors ${
                        plan.popular
                          ? "bg-contrast text-contrast-fg hover:bg-contrast-hover"
                          : "bg-foreground/[0.06] text-strong hover:bg-foreground/[0.1] hover:text-foreground border border-border/60"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* One-meter / no-meter callout */}
      <div className="px-6 -mt-20 pb-16">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-[15px] text-muted-foreground max-w-[780px] mx-auto">
            {isSelfHosted ? (
              <>
                <span className="text-strong font-medium">Unlimited data. Unlimited seats — humans and AI agents.</span>{" "}
                Flat prices banded by company size, self-certified. Licenses verify offline —{" "}
                <span className="text-strong font-medium">no license server, no check-in</span>.
              </>
            ) : (
              <>
                <span className="text-strong font-medium">One meter: events.</span> Log lines count as events,
                spending caps are on by default, and every plan includes{" "}
                <span className="text-strong font-medium">unlimited seats</span> — humans and AI agents.
                No per-replay, per-flag, or per-GB line items.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Startup program banner */}
      <div className="px-6 pb-24">
        <div className="max-w-[1100px] mx-auto rounded-2xl border border-brand/25 bg-elevated px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
          <div className="text-center md:text-left">
            <p className="text-[17px] text-foreground font-medium">
              Startup program — Pro free for 12 months
            </p>
            <p className="text-[14px] text-muted-foreground mt-1">
              Founded less than 3 years ago and raised under $5M? Full Pro on us — Cloud or self-hosted.
            </p>
          </div>
          <a
            href="mailto:hello@tell.rs?subject=Startup%20Program"
            className="shrink-0 px-5 py-2.5 text-[14px] font-medium text-strong border border-border rounded-lg hover:border-muted-foreground hover:text-foreground transition"
          >
            Apply
          </a>
        </div>
      </div>

      {/* Compare plans */}
      <div className="px-6 pb-32">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground mb-6 text-center" style={{ fontWeight: 510 }}>
            Compare plans
          </h2>

          {/* Metric-tree positioning line */}
          <p className="text-[15px] text-muted-foreground text-center mb-16 max-w-[780px] mx-auto">
            Metric trees on every plan — AI builder and time travel on Pro. At
            Mixpanel: an Enterprise-only add-on.
          </p>

          {/* Sticky table header */}
          <div className={`hidden md:grid ${compareGridCls} sticky top-14 z-10 bg-background/95 backdrop-blur-sm border-b border-border/60 pb-4 pt-4 -mx-1 px-1`}>
            <div />
            {plans.map((plan) => (
              <div key={plan.name} className="text-center">
                <span className={`text-[15px] font-semibold ${plan.popular ? "text-brand" : "text-foreground"}`}>
                  {plan.name}
                </span>
              </div>
            ))}
          </div>

          {/* Sections */}
          {compare.map((section) => (
            <div key={section.category}>
              <div className="pt-10 pb-4 border-b border-border/40">
                <span className="text-[13px] font-semibold text-muted uppercase tracking-wider">
                  {section.category}
                </span>
              </div>
              {section.rows.map((row) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-1 ${compareGridCls} py-4 border-b border-border/20 group hover:bg-foreground/[0.01] transition-colors`}
                >
                  <div className="text-[15px] text-strong flex items-center">{row.feature}</div>
                  {row.values.map((value, i) => (
                    <div key={plans[i]?.name ?? i} className="hidden md:flex items-center justify-center text-center">
                      <CellValue value={value} />
                    </div>
                  ))}
                  {/* Mobile */}
                  <div className="md:hidden mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
                    {row.values.map((value, i) => (
                      <span key={plans[i]?.name ?? i} className="text-faint">
                        {plans[i]?.name}: <CellValue value={value} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>

      {/* Replace your stack */}
      <div className="px-6 pb-32">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground mb-6 text-center" style={{ fontWeight: 510 }}>
            One bill instead of three
          </h2>
          <div className="max-w-[820px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Without Tell */}
              <div className="rounded-xl border border-border/50 p-6">
                <p className="text-[13px] text-faint uppercase tracking-wider mb-5">Without Tell</p>
                <div className="flex items-baseline justify-between py-2.5">
                  <div>
                    <p className="text-[15px] text-muted">Mixpanel</p>
                    <p className="text-[13px] text-faint">10M events, list price before add-ons</p>
                  </div>
                  <span className="text-[15px] text-muted tabular-nums shrink-0 ml-4">$2,520/mo</span>
                </div>
                <div className="flex items-baseline justify-between py-2.5">
                  <div>
                    <p className="text-[15px] text-muted">Datadog</p>
                    <p className="text-[13px] text-faint">Logs and errors only</p>
                  </div>
                  <span className="text-[15px] text-muted tabular-nums shrink-0 ml-4">$300/mo</span>
                </div>
                <div className="flex items-baseline justify-between py-2.5 mb-4">
                  <div>
                    <p className="text-[15px] text-muted">Supermetrics</p>
                    <p className="text-[13px] text-faint">7 sources, daily refresh</p>
                  </div>
                  <span className="text-[15px] text-muted tabular-nums shrink-0 ml-4">$159/mo</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="text-[15px] text-muted">3 tools, 3 SDKs</span>
                  <span className="text-[24px] font-semibold text-strong tabular-nums">$2,979<span className="text-[15px] text-muted-foreground font-normal">/mo</span></span>
                </div>
                {isSelfHosted && (
                  <p className="text-[13px] text-faint mt-2">None of these offer self-hosting.</p>
                )}
              </div>

              {/* With Tell */}
              <div className="rounded-xl border border-brand/30 bg-elevated p-6 relative flex flex-col">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
                <p className="text-[13px] text-brand uppercase tracking-wider mb-5">
                  {isSelfHosted ? "Tell Self-hosted Pro" : "With Tell"}
                </p>
                <div className="flex-1 flex flex-col justify-between">
                  {isSelfHosted ? (
                    <div>
                      <div className="flex items-baseline justify-between py-2.5">
                        <p className="text-[15px] text-strong">Events</p>
                        <span className="text-[13px] text-faint">uncapped, your hardware</span>
                      </div>
                      <div className="flex items-baseline justify-between py-2.5">
                        <p className="text-[15px] text-strong">Logs and errors</p>
                        <span className="text-[13px] text-faint">uncapped</span>
                      </div>
                      <div className="flex items-baseline justify-between py-2.5 mb-4">
                        <p className="text-[15px] text-strong">Unlimited connectors</p>
                        <span className="text-[13px] text-faint">hourly refresh</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-between py-2.5">
                        <p className="text-[15px] text-strong">10M events</p>
                        <span className="text-[13px] text-faint">included</span>
                      </div>
                      <div className="flex items-baseline justify-between py-2.5">
                        <p className="text-[15px] text-strong">Logs and errors</p>
                        <span className="text-[13px] text-faint">count as events</span>
                      </div>
                      <div className="flex items-baseline justify-between py-2.5 mb-4">
                        <p className="text-[15px] text-strong">Unlimited connectors</p>
                        <span className="text-[13px] text-faint">hourly refresh</span>
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-brand/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] text-strong">{isSelfHosted ? "1 binary, 1 SDK" : "1 tool, 1 SDK"}</span>
                      <span className="text-[24px] font-semibold text-foreground tabular-nums">$99<span className="text-[15px] text-muted-foreground font-normal">/mo</span></span>
                    </div>
                    {isSelfHosted && (
                      <p className="text-[13px] text-faint mt-1">Flat price — companies under 100 employees</p>
                    )}
                    <p className="text-[15px] text-brand font-medium mt-2 text-right">Save $34,560/year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-6 pb-32">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground mb-16 text-center" style={{ fontWeight: 510 }}>
            Questions
          </h2>

          <div className="max-w-[1100px] mx-auto divide-y divide-border/50">
            <FaqItem
              question="Is the Free plan actually free?"
              answer="Yes — no time limit, no credit card. On Cloud you get 2M events per month, and log lines count as events, so there's exactly one number to watch. On Self-hosted there are no usage caps at all — you run your own infrastructure — with 1 workspace, 3 connectors, and 10 AI queries per day. There's no separate trial: Free is the trial. If you cancel Pro later, you keep it until the end of the billing period, then drop back to Free with your data intact."
            />
            <FaqItem
              question="How is usage metered?"
              answer="One meter: events. An event is any data point sent to Tell — a page view, API call, form submission, log line, or custom action. Internal events like identity merges and session boundaries don't count toward your limit. There are no separate meters for logs by GB, session replays, or feature-flag requests. Self-hosted plans have no meter at all."
            />
            <FaqItem
              question="What happens if I exceed 2M events on Cloud Free?"
              answer="Nothing silent. The spending cap is on by default: you get a warning as you approach the limit and a grace window while you decide. Then you choose — enable overage at $0.10 per 1K events, upgrade to Pro ($99/mo with 10M events included and $0.03/1K after), or stay capped. Data isn't silently dropped, and there's no overage billing you didn't opt into."
            />
            <FaqItem
              question="What's the difference between Cloud and Self-hosted?"
              answer="Same product, same binary, different tradeoffs. Cloud: we run the infrastructure, you start in 2 minutes, and pricing meters events (one meter, capped by default). Self-hosted: you run it on your own servers, your data stays on your infrastructure, and there are no meters — flat prices banded by company size. You can switch either way: export from Cloud and import into a self-hosted instance, or vice versa — dashboards, saved queries, and configuration transfer as-is. Annual billing takes 15% off paid plans on both."
            />
            <FaqItem
              question="How do the self-hosted company-size bands work?"
              answer="Self-hosted paid plans are flat prices banded by company size: Pro ($99/mo) for companies under 100 employees, Business ($349/mo) under 1,000, Enterprise (from $24k/year) above that. You self-certify your band — no telemetry, no verification calls, just an audit clause in the license like Docker's. The terms you sign up under are the terms you keep — bands don't change retroactively."
            />
            <FaqItem
              question="Does self-hosted Tell phone home?"
              answer="License validation doesn't phone home. Paid self-hosted licenses are cryptographically signed files that verify offline — no license server, no check-in, no license usage reporting. On annual billing you get one key valid for the full year; on monthly billing each key is valid for about two months and a fresh one arrives with each invoice on your account page — a re-download, not a check-in. Air-gapped installs are supported on Enterprise. Separately, the software includes optional anonymous product telemetry (not your data), on by default and switchable off in the config. If a license expires, paid features soft-degrade to the Free tier; ingestion and your data are untouched."
            />
            <FaqItem
              question="What's the Startup Program?"
              answer="Early-stage startups get the full Pro plan free for 12 months — Cloud or Self-hosted, your choice. Eligibility: founded less than 3 years ago, raised less than $5M. After the first year, you continue on Pro at $99/mo. Apply by emailing us."
            />
            <FaqItem
              question="How long do you keep my data?"
              answer="All data — events, logs, metrics, business data, and marks — follows the same retention policy. Cloud Free: 1 year. Pro: 3 years. Enterprise: custom, up to whatever your compliance requires. Self-hosted: unlimited — it's your hardware, your rules. Retention is included in the plan price; there's no separate retention charge."
            />
            <FaqItem
              question="What connectors are available?"
              answer="Tell ships with connectors for Shopify, GitHub, Stripe, Meta Ads, Google Ads, Cloudflare, Klaviyo, Resend, Dub, and YouTube — new ones ship regularly, and community-built WASM plugins extend this further. The Free plan includes 3 active connectors; all paid plans are unlimited."
            />
            <FaqItem
              question="Why don't you charge per seat?"
              answer="Because analytics shouldn't be something only one person on the team can afford to look at — and because in an agentic world, your 'users' are increasingly AI agents querying on your behalf. Every Tell plan includes unlimited seats, human and agent alike. We don't charge per seat."
            />
          </div>
        </div>
      </div>

      {/* Price calculator — Cloud only, right before CTA */}
      {mode === "cloud" && <PriceCalculator billing={billing} />}

      {/* Bottom CTA */}
      <section className="py-32 md:py-44 px-6 relative overflow-hidden">
        <DotGrid focusPoints={[[0.5, 0.5]]} />
        <div className="max-w-[1340px] mx-auto text-center relative">
          <h2 className="text-[42px] md:text-[58px] font-semibold tracking-[-0.035em] text-foreground leading-[1.08] mb-4">
            One platform. One bill.
          </h2>
          <p className="text-[17px] text-muted-foreground mb-10">
            Free forever under 2M events. One meter, no surprises, no credit card to start.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-contrast text-contrast-fg text-[15px] font-medium rounded-lg hover:bg-contrast-hover transition"
            >
              Get started free
            </Link>
            <a
              href="mailto:hello@tell.rs"
              className="px-5 py-2.5 text-[15px] font-medium text-muted border border-border rounded-lg hover:border-faint hover:text-strong transition"
            >
              Talk to us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const EVENT_STEPS = [1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 50, 75, 100];

function StepSlider({
  steps,
  value,
  onChange,
  format,
}: {
  steps: number[];
  value: number;
  onChange: (idx: number) => void;
  format: (v: number) => string;
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
        <div className="absolute left-0 right-0 h-[2px] bg-pill-bg" />
        <div className="absolute left-0 h-[2px] bg-brand" style={{ width: `${pct}%` }} />
        {/* Dots */}
        {steps.map((_, i) => {
          const x = (i / (steps.length - 1)) * 100;
          return (
            <div
              key={i}
              className={`absolute w-[6px] h-[6px] rounded-full -translate-x-1/2 ${
                i <= value ? "bg-brand" : "bg-track"
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
                i === value ? "text-foreground font-semibold" : "text-faint"
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

  const eventsM = EVENT_STEPS[eventIdx];

  // Free path: $0 base, 2M included, opt-in overage at $0.10/1K events
  const freeTotal = (Math.max(0, eventsM - 2) * 1_000_000 / 1000) * 0.10;

  // Pro path: $99/$84 base, 10M included, overage at $0.03/1K
  const proBase = billing === "yearly" ? 84 : 99;
  const proTotal = proBase + (Math.max(0, eventsM - 10) * 1_000_000 / 1000) * 0.03;

  const proIsCheaper = proTotal <= freeTotal;
  const total = proIsCheaper ? proTotal : freeTotal;
  const plan = proIsCheaper ? "Pro" : "Free";

  // Mixpanel Growth reference: first 1M free, then ~$0.28/1K events, before add-ons.
  const mixpanel = (Math.max(0, eventsM - 1) * 1_000_000 / 1000) * 0.28;

  return (
    <div className="px-6 pb-32">
      <div className="max-w-[1100px] mx-auto">
        {/* Header row: title left, price right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <h2 className="text-[48px] leading-[1] tracking-[-0.022em] text-foreground" style={{ fontWeight: 510 }}>
            Estimate your cost
          </h2>
          <div className="mt-4 md:mt-0 md:text-right">
            <div className="flex items-baseline gap-2 md:justify-end">
              <span className="text-[48px] font-semibold tracking-[-0.03em] text-foreground leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                ${Math.round(total).toLocaleString()}
              </span>
              <span className="text-[17px] text-muted-foreground">/mo on {plan}</span>
            </div>
            {mixpanel > total && (
              <p className="text-[13px] text-faint mt-2">
                Mixpanel Growth at this volume: ~${Math.round(mixpanel).toLocaleString()}/mo before add-ons
              </p>
            )}
          </div>
        </div>

        {/* Slider */}
        <div>
          <p className="text-[13px] text-muted-foreground mb-3">
            Monthly events <span className="text-faint">— log lines count as events; there's no second meter</span>
          </p>
          <StepSlider
            steps={EVENT_STEPS}
            value={eventIdx}
            onChange={setEventIdx}
            format={(v) => `${v}M`}
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
        <span className="text-[17px] text-foreground font-medium leading-snug group-hover:text-strong transition-colors">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-muted-foreground shrink-0 mt-0.5 transition-transform ${open ? "rotate-45" : ""}`}
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
        <p className="text-[15px] text-muted leading-relaxed pr-10">
          {answer}
        </p>
      </div>
    </div>
  );
}

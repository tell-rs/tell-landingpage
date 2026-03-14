import { useState, type ReactNode } from "react";

type Category = "all" | "revenue" | "marketing" | "development" | "infrastructure";

interface Connector {
  name: string;
  category: Category;
  categoryLabel: string;
  description: string;
  signals: string[];
  soon?: boolean;
  icon: ReactNode;
}

const connectors: Connector[] = [
  {
    name: "Shopify",
    category: "revenue",
    categoryLabel: "Revenue",
    description:
      "Pull in orders, products, and customer data. Cross-reference with ad spend, attribute revenue to campaigns, and spot trends before they show up in your dashboard.",
    signals: ["Orders & revenue", "Customer profiles", "Product performance", "Campaign attribution", "Inventory levels"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M15.34 3.27a.6.6 0 00-.54-.05 7.15 7.15 0 00-.73.33c-.13.07-.26.15-.4.21a3.55 3.55 0 00-.58-.95c-.8-.87-1.97-1.29-3.47-1.24a4.6 4.6 0 00-3.5 1.77A6.9 6.9 0 004.9 7.06l-2.7.84a1.47 1.47 0 00-1 1.06L.03 20.64l12.2 2.12 6.62-1.43c-.04-.07-3.2-16.78-3.51-18.06zM10.4 4.02c-.23.07-.48.15-.76.24v-.17a3.9 3.9 0 00-.33-1.7 2.1 2.1 0 011.09 1.63zm-2.28.72c-.73.23-1.53.47-2.34.73a5.14 5.14 0 011.47-2.63 2.56 2.56 0 01.96-.57 3.3 3.3 0 01-.09 2.47zm-1.7-3.2a1.78 1.78 0 011.06.32 5.02 5.02 0 00-1.56.74 6.12 6.12 0 00-1.86 3.32l-1.83.57A5.35 5.35 0 016.42 1.54z" fill="currentColor" />
        <path d="M14.8 3.22c-.01-.02-.2-.04-.2-.04s-1.1-1.07-1.2-1.17l-.17.04L12.2 22.76l6.62-1.43S15.34 3.73 15.3 3.5a.42.42 0 00-.5-.28z" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    category: "development",
    categoryLabel: "Development",
    description:
      "Sync stars, forks, clones, and issues. Correlate open-source traction with signups, compare repo growth across releases, and track contributor activity.",
    signals: ["Stars & forks", "Clone traffic", "Issue activity", "Release impact", "Contributor trends"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
      </svg>
    ),
  },
  {
    name: "Stripe",
    category: "revenue",
    categoryLabel: "Revenue",
    description:
      "Sync subscriptions, invoices, and payment history. Analyze churn patterns, compare cohort LTV, and correlate payment failures with product changes.",
    signals: ["Subscription lifecycle", "Invoice & payment events", "Churn analysis", "Cohort LTV", "Plan migrations"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
      </svg>
    ),
  },
  {
    name: "Meta Ads",
    category: "marketing",
    categoryLabel: "Marketing",
    description:
      "Pull engagement data, impressions, and conversion metrics. Compare ad spend against signups, measure ROAS across campaigns, and track creative performance.",
    signals: ["Ad spend & ROAS", "Impression reach", "Campaign conversions", "Audience demographics", "Creative performance"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.93 3.78-3.93 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
      </svg>
    ),
  },
  {
    name: "Cloudflare",
    category: "infrastructure",
    categoryLabel: "Infrastructure",
    description:
      "Monitor DNS queries, traffic analytics, and security events. Correlate cache performance with user experience and track bot mitigation effectiveness.",
    signals: ["DNS analytics", "Traffic patterns", "Security events", "Cache performance", "Bot mitigation"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.51 17.93l.39-1.36a1.62 1.62 0 00-.09-1.19 1.53 1.53 0 00-.93-.72l-8.72-.3a.27.27 0 01-.22-.13.27.27 0 01.02-.26.36.36 0 01.3-.17l8.88-.3a3.2 3.2 0 002.52-2.09l.64-1.83a.35.35 0 00.01-.2A6.31 6.31 0 0013.08 4a6.39 6.39 0 00-6.17 4.81 3.63 3.63 0 00-2.54-.63 3.66 3.66 0 00-3.12 3.45.35.35 0 00.01.1A4.93 4.93 0 00.08 17.36a.33.33 0 00.33.28h15.74a.38.38 0 00.36-.28z" opacity="0.8" />
        <path d="M18.74 8.09a.18.18 0 00-.18.01 1.87 1.87 0 00-.78.9l-.38 1.34a1.62 1.62 0 00.09 1.19c.2.34.53.59.93.72l2.37.08a.27.27 0 01.22.13.27.27 0 01-.01.26.36.36 0 01-.3.17l-2.53.09a3.2 3.2 0 00-2.52 2.08l-.18.52a.18.18 0 00.17.24h6.98a.36.36 0 00.34-.24 5.48 5.48 0 00-4.22-7.49z" />
      </svg>
    ),
  },
  {
    name: "Klaviyo",
    category: "marketing",
    categoryLabel: "Email & SMS",
    description:
      "Track campaign sends, opens, clicks, and revenue attribution. Monitor flow performance, list growth, and subscriber engagement over time.",
    signals: ["Campaign performance", "Flow analytics", "List growth", "Subscriber engagement", "Revenue attribution"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 4l10 8 10-8v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm0 0a2 2 0 012-2h16a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Resend",
    category: "marketing",
    categoryLabel: "Email",
    description:
      "Track delivery rates, bounces, and domain reputation. Monitor transactional email performance alongside your product events.",
    signals: ["Delivery rates", "Bounce tracking", "Domain reputation", "Template performance"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    name: "Dub",
    category: "marketing",
    categoryLabel: "Links",
    description:
      "Track link clicks, geographic distribution, and device breakdown. Correlate link performance with conversion events and signups.",
    signals: ["Click analytics", "Geographic reach", "Device breakdown", "Referral tracking"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

const filters: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Revenue", value: "revenue" },
  { label: "Marketing", value: "marketing" },
  { label: "Development", value: "development" },
  { label: "Infrastructure", value: "infrastructure" },
];

const VISIBLE_COUNT = 4;

export function ConnectorsSection() {
  const [active, setActive] = useState<Category>("all");
  const [activeCard, setActiveCard] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const filtered = active === "all" ? connectors : connectors.filter((c) => c.category === active);
  const showExpand = filtered.length > VISIBLE_COUNT && !expanded;
  const visible = expanded ? filtered : filtered.slice(0, VISIBLE_COUNT);

  return (
    <section className="px-6" style={{ paddingTop: 96, paddingBottom: 128 }}>
      <div className="max-w-[1340px] mx-auto">
        {/* Header */}
        <div className="md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-14">
          <h2
            className="text-[48px] leading-[1] tracking-[-0.022em] text-white"
            style={{ fontWeight: 510, fontFeatureSettings: '"cv01", "ss03"' }}
          >
            Connect every signal
            <br />
            across your stack
          </h2>
          <p className="text-zinc-400 text-[24px] leading-[1.33] tracking-[-0.012em] md:pt-3">
            WASM plugin connectors pull data from Stripe, Shopify, GitHub,
            and more — crash-isolated, hot-loadable. 15 integrations,
            276 metrics, all queryable alongside your events.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="md:px-8 mb-8">
          <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-900/60 p-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => { setActive(f.value); setExpanded(false); setActiveCard(0); }}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  active === f.value
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map((c, i) => {
            const isActive = i === activeCard;
            return (
              <div
                key={c.name}
                onMouseEnter={() => setActiveCard(i)}
                className={`group rounded-xl border flex flex-col transition-all duration-200 ${
                  c.soon ? "opacity-50" : ""
                } ${
                  isActive
                    ? "bg-[#0d0b1a] border-brand/20"
                    : "bg-[#111113] border-zinc-800/60 hover:border-zinc-700"
                }`}
                style={{ padding: "24px 24px 28px" }}
              >
                {/* Top: icon + name + category */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    isActive ? "bg-brand/15 text-brand" : "bg-zinc-800/80 text-zinc-300"
                  }`}>
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className={`text-[16px] font-medium transition-colors duration-200 ${
                        isActive ? "text-white" : "text-zinc-300"
                      }`}>{c.name}</h3>
                      {c.soon && (
                        <span className="text-[11px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
                      )}
                    </div>
                    <p className={`text-[13px] transition-colors duration-200 ${
                      isActive ? "text-zinc-400" : "text-zinc-500"
                    }`}>{c.categoryLabel}</p>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-[14px] leading-[1.6] mb-8 transition-colors duration-200 ${
                  isActive ? "text-zinc-300" : "text-zinc-500"
                }`}>
                  {c.description}
                </p>

                {/* Data signals */}
                <div className="mt-auto">
                  <p className={`text-[11px] font-medium uppercase tracking-wider mb-3 transition-colors duration-200 ${
                    isActive ? "text-zinc-500" : "text-zinc-600"
                  }`}>
                    Data Signals
                  </p>
                  <ul className="space-y-2">
                    {c.signals.map((s) => (
                      <li key={s} className={`flex items-center gap-2.5 text-[13px] transition-colors duration-200 ${
                        isActive ? "text-zinc-300" : "text-zinc-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${
                          isActive ? "bg-zinc-400" : "bg-zinc-600"
                        }`} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more */}
        {showExpand && (
          <div className="mt-8 md:px-8">
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 text-[14px] text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              Show all {filtered.length} connectors <span>&rarr;</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

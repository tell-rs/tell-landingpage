/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { TellProvider, useTell } from "@tell-rs/react";

import appCss from "../../styles.css?url";
import { getAllEntries } from "../content/changelog";
import { DotGrid } from "../components/dot-grid";

// Dark is the default theme; ThemeToggle removes the .dark class for light
// mode and persists the choice. The inline script in head() applies the
// stored choice before first paint to avoid a flash.
const THEME_INIT_SCRIPT =
  '(function(){try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}})()';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tell - Analytics that tell the whole story" },
      { name: "description", content: "Product analytics, logs, and business signals unified. See what changed when metrics drop. 64M events/sec. Self-host in 5 minutes." },
      // Open Graph (default for all pages)
      { property: "og:title", content: "Tell - Analytics that tell the whole story" },
      { property: "og:description", content: "Product analytics, logs, and business signals unified. See what changed when metrics drop. 64M events/sec. Self-host in 5 minutes." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tell.rs" },
      { property: "og:site_name", content: "Tell" },
      { property: "og:image", content: "https://tell.rs/og.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Tell — Analytics that tell the whole story" },
      { name: "theme-color", content: "#0a0a0b" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tell - Analytics that tell the whole story" },
      { name: "twitter:description", content: "Product analytics, logs, and business signals unified. 64M events/sec. Self-host in 5 minutes." },
      { name: "twitter:image", content: "https://tell.rs/og.png" },
      { name: "twitter:image:alt", content: "Tell — Analytics that tell the whole story" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preload", href: "/fonts/space-grotesk-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/jetbrains-mono-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      { children: THEME_INIT_SCRIPT },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Tell",
          url: "https://tell.rs",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Linux, macOS",
          description:
            "Product analytics, logs, and business signals unified. 64M events/sec ingestion, self-hosted or cloud.",
          offers: [
            { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free forever" },
            { "@type": "Offer", price: "99", priceCurrency: "USD", description: "Pro, per month" },
            { "@type": "Offer", price: "84", priceCurrency: "USD", description: "Pro, per month billed annually" },
          ],
          publisher: {
            "@type": "Organization",
            name: "Tell",
            url: "https://tell.rs",
            logo: "https://tell.rs/apple-touch-icon.png",
            sameAs: ["https://github.com/tell-rs"],
          },
        }),
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

const featureColumns = [
  {
    heading: "Analyze",
    items: [
      { label: "Product Analytics", desc: "Funnels, retention & lifecycle", href: "/#product-analytics" },
      { label: "Logs", desc: "Search, correlate & detect anomalies", href: "/#logs" },
    ],
  },
  {
    heading: "Connect",
    items: [
      { label: "Marketing Data", desc: "GitHub, YouTube, Stripe & ads, charted", href: "/#marketing-data" },
      { label: "Pipeline", desc: "Sources, routing & transforms", href: "/#performance" },
      { label: "Integrations", desc: "Stripe, Shopify, GitHub & more", href: "/#integrations" },
    ],
  },
  {
    heading: "Intelligence",
    items: [
      { label: "AI", desc: "Talk with your data", href: "/#ai" },
      { label: "Audiences", desc: "ML-powered segments & predictions", href: "/#audiences" },
    ],
  },
];

const latestChangelog = getAllEntries()[0];

/** Sun/moon button — toggles the .dark class on <html> and persists to localStorage. */
function ThemeToggle({ className = "" }: { className?: string }) {
  // Server renders the dark icon; sync with the real class after hydration.
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private mode) — theme still applies for the session
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${className}`}
    >
      {dark ? (
        // Sun — offer light mode
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon — offer dark mode
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-announce border-b border-brand/10">
      <div className="max-w-[1340px] mx-auto px-6 md:px-14 flex items-center justify-center h-9">
        <p className="text-[13px] text-strong truncate">
          <span className="text-brand font-medium">New</span>
          <span className="text-faint mx-2">—</span>
          <Link to="/changelog/$slug" params={{ slug: latestChangelog.slug }} className="text-muted hover:text-foreground transition-colors">
            {latestChangelog.title} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

function Nav() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change and on Escape
  useEffect(() => {
    setMobileOpen(false);
    setFeaturesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFeaturesOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openFeatures = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFeaturesOpen(true);
  };
  const closeFeatures = () => {
    timeoutRef.current = setTimeout(() => setFeaturesOpen(false), 150);
  };

  const barVisible = isHomePage && !scrolled;

  return (
    <>
    {isHomePage && (
      <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${barVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
        <AnnouncementBar />
      </div>
    )}
    <nav className={`fixed w-full px-6 py-3 z-50 transition-all duration-300 ${
      barVisible ? "top-9" : "top-0"
    } ${
      scrolled ? "bg-background/90 backdrop-blur-md border-b border-foreground/5" : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-[1340px] mx-auto md:px-8">
      <div className="relative flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight">Tell</span>
        </Link>

        {/* Center nav links - absolutely positioned for true centering */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {/* Features dropdown */}
          <div className="relative" onMouseEnter={openFeatures} onMouseLeave={closeFeatures}>
            <button
              onClick={() => setFeaturesOpen((o) => !o)}
              onFocus={openFeatures}
              aria-expanded={featuresOpen}
              aria-haspopup="menu"
              className="text-[13px] text-muted hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
            >
              Features
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${featuresOpen ? "rotate-180" : ""}`} aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {featuresOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3" style={{ animation: "dropdown-in 150ms ease-out" }}>
                <div className="w-[620px] rounded-xl border border-border/60 bg-card/98 backdrop-blur-xl shadow-2xl flex flex-col">
                  {/* 3-column grid */}
                  <div className="grid grid-cols-3 divide-x divide-border/40 p-1.5 pb-3">
                    {featureColumns.map((col) => (
                      <div key={col.heading} className="px-1">
                        <span className="text-[11px] font-medium text-muted uppercase tracking-wider px-2.5 pt-2 pb-1.5 block">{col.heading}</span>
                        {col.items.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="flex flex-col gap-1 px-2.5 py-2 rounded-md hover:bg-foreground/[0.04] transition-colors group"
                            onClick={() => setFeaturesOpen(false)}
                          >
                            <span className="text-[15px] text-foreground font-medium">{item.label}</span>
                            <span className="text-[14px] text-muted group-hover:text-strong transition-colors leading-snug">{item.desc}</span>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* Bottom strip */}
                  <Link
                    to="/changelog/$slug"
                    params={{ slug: latestChangelog.slug }}
                    className="flex items-center justify-between rounded-b-xl px-5 py-2.5 bg-foreground/[0.04] hover:bg-foreground/[0.07] transition-colors"
                    onClick={() => setFeaturesOpen(false)}
                  >
                    <span className="text-[14px]"><span className="text-brand font-semibold">New:</span> <span className="text-strong">{latestChangelog.title}</span></span>
                    <span className="text-brand/50 text-[14px]">→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link to="/pricing" className="text-[13px] text-muted hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/download" className="text-[13px] text-muted hover:text-foreground transition-colors">Self-host</Link>
          <a href="https://docs.tell.rs" className="text-[13px] text-muted hover:text-foreground transition-colors">Docs</a>
          <Link to="/changelog" className="text-[13px] text-muted hover:text-foreground transition-colors">Changelog</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 md:gap-5">
          <ThemeToggle className="hidden sm:block" />
          <a
            href="https://github.com/tell-rs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tell on GitHub — open source SDKs and agents"
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
          </a>
          <Link
            to="/login"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 bg-contrast text-contrast-fg rounded border border-contrast/80 text-sm font-medium hover:bg-contrast-hover transition-colors"
          >
            Sign Up
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden p-1.5 -mr-1.5 text-strong hover:text-foreground transition-colors"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/60 max-h-[calc(100vh-56px)] overflow-y-auto">
          <div className="px-6 py-5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Features</p>
            <div className="grid grid-cols-2 gap-x-4">
              {featureColumns.flatMap((col) => col.items).map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-[15px] text-strong hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="border-t border-border/60 mt-4 pt-4 flex flex-col">
              <Link to="/pricing" onClick={() => setMobileOpen(false)} className="py-2 text-[15px] text-strong hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/download" onClick={() => setMobileOpen(false)} className="py-2 text-[15px] text-strong hover:text-foreground transition-colors">Self-host</Link>
              <a href="https://docs.tell.rs" className="py-2 text-[15px] text-strong hover:text-foreground transition-colors">Docs</a>
              <Link to="/changelog" onClick={() => setMobileOpen(false)} className="py-2 text-[15px] text-strong hover:text-foreground transition-colors">Changelog</Link>
              <a href="https://github.com/tell-rs" target="_blank" rel="noopener noreferrer" className="py-2 text-[15px] text-strong hover:text-foreground transition-colors">GitHub</a>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 text-[15px] text-strong hover:text-foreground transition-colors sm:hidden">Login</Link>
              <div className="py-2 flex items-center justify-between sm:hidden">
                <span className="text-[15px] text-strong">Theme</span>
                <ThemeToggle />
              </div>
            </div>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="mt-4 block w-full text-center px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-[#746cf0] transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-6 text-muted border-t border-border/40 bg-background">
      <div className="max-w-[1340px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <span className="text-foreground font-bold text-lg">Tell</span>
            <p className="text-faint text-xs mt-2">Analytics platform</p>
          </div>
          <div>
            <h4 className="text-foreground text-[13px] font-medium mb-4">Product</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="/#product-analytics" className="hover:text-foreground transition">Features</a></li>
              <li><Link to="/pricing" className="hover:text-foreground transition">Pricing</Link></li>
              <li><a href="/#integrations" className="hover:text-foreground transition">Connectors</a></li>
              <li><Link to="/download" className="hover:text-foreground transition">Self-host</Link></li>
              <li><Link to="/ot" className="hover:text-foreground transition">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground text-[13px] font-medium mb-4">Resources</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="https://docs.tell.rs" className="hover:text-foreground transition">Docs</a></li>
              <li><Link to="/changelog" className="hover:text-foreground transition">Changelog</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition">About</Link></li>
              <li><a href="mailto:hello@tell.rs" className="hover:text-foreground transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground text-[13px] font-medium mb-4">Legal</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/legal/$slug" params={{ slug: "terms" }} className="hover:text-foreground transition">Terms</Link></li>
              <li><Link to="/legal/$slug" params={{ slug: "privacy" }} className="hover:text-foreground transition">Privacy</Link></li>
              <li><Link to="/legal/$slug" params={{ slug: "dpa" }} className="hover:text-foreground transition">DPA</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground text-[13px] font-medium mb-4">Open source</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="https://github.com/tell-rs/witness" className="hover:text-foreground transition">Witness agent</a></li>
              <li><a href="https://github.com/tell-rs/tell-rs" className="hover:text-foreground transition">Rust SDK</a></li>
              <li><a href="https://github.com/tell-rs/tell-go" className="hover:text-foreground transition">Go SDK</a></li>
              <li><a href="https://github.com/tell-rs/tell-node" className="hover:text-foreground transition">TypeScript SDK</a></li>
              <li><a href="https://github.com/tell-rs/tell-swift" className="hover:text-foreground transition">Swift SDK</a></li>
              <li><a href="https://github.com/tell-rs/tell-cpp" className="hover:text-foreground transition">C++ SDK</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-muted-foreground">
          <p>© 2026 Tell · Singapore</p>
          <p>Built by the founder of Logpoint</p>
          <a href="https://github.com/tell-rs/" target="_blank" rel="noopener noreferrer" aria-label="Tell on GitHub" className="text-muted-foreground hover:text-strong transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

function NotFoundComponent() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <DotGrid focusPoints={[[0.5, 0.25], [0.5, 0.85]]} />
      <div className="relative text-center max-w-[560px]">
        <p className="font-mono text-brand text-[13px] tracking-wider mb-5">404 — NOT FOUND</p>
        <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.035em] text-foreground leading-[1.05] mb-5">
          This page doesn't tell a story.
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed mb-9">
          The URL may have a typo, or the page moved. The data you're looking
          for is probably one click away.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-[#746cf0] transition"
          >
            Back home
          </Link>
          <Link
            to="/changelog"
            className="px-5 py-2.5 text-sm font-medium text-muted border border-border rounded-lg hover:border-faint hover:text-strong transition"
          >
            Changelog
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Track page views on route changes via TanStack Router. */
function TellPageTracker() {
  const tell = useTell();
  const location = useLocation();

  useEffect(() => {
    tell.track("Page Viewed", {
      url: window.location.href,
      path: location.pathname,
      referrer: document.referrer,
      title: document.title,
    });
  }, [location.pathname, tell]);

  return null;
}

function RootComponent() {
  return (
    <RootDocument>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <TellProvider apiKey="9c048d72732ce3523f192e6447177a83" options={{ endpoint: "https://t.tell.rs" }}>
          {children}
          <TellPageTracker />
        </TellProvider>
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

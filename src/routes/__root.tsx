/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { TellProvider, useTell } from "@tell-rs/react";

import appCss from "../../styles.css?url";
import { getAllEntries } from "../content/changelog";

// Theme toggle: set to true for dark mode, false for light mode
const DARK_MODE = true;

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
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tell - Analytics that tell the whole story" },
      { name: "twitter:description", content: "Product analytics, logs, and business signals unified. 64M events/sec. Self-host in 5 minutes." },
    ],
    links: [
      { rel: "preload", href: "/fonts/space-grotesk-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/jetbrains-mono-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

const featureColumns = [
  {
    heading: "Analyze",
    items: [
      { label: "Product Analytics", desc: "Funnels, retention & lifecycle", href: "#features" },
      { label: "Logs", desc: "Search, correlate & detect anomalies", href: "#features" },
    ],
  },
  {
    heading: "Connect",
    items: [
      { label: "Pipeline", desc: "Sources, routing & transforms", href: "#features" },
      { label: "Integrations", desc: "Stripe, Shopify, GitHub & 12 more", href: "#features" },
    ],
  },
  {
    heading: "Intelligence",
    items: [
      { label: "AI", desc: "Talk with your data", href: "#features" },
      { label: "Audiences", desc: "ML-powered segments & predictions", href: "#features" },
    ],
  },
];

const latestChangelog = getAllEntries()[0];

function AnnouncementBar() {
  return (
    <div className="bg-[#0d0b1a] border-b border-brand/10">
      <div className="max-w-[1340px] mx-auto px-6 md:px-14 flex items-center justify-center h-9">
        <p className="text-[13px] text-zinc-300">
          <span className="text-brand font-medium">Launching soon</span>
          <span className="text-zinc-600 mx-2">—</span>
          <Link to="/signup" className="text-zinc-400 hover:text-white transition-colors">
            Join the waitlist
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      scrolled ? "bg-background/90 backdrop-blur-md border-b border-white/5" : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-[1340px] mx-auto md:px-8">
      <div className="relative flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight">Tell</span>
        </Link>

        {/* Center nav links - absolutely positioned for true centering, only on homepage */}
        {isHomePage && (
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {/* Features dropdown */}
            <div className="relative" onMouseEnter={openFeatures} onMouseLeave={closeFeatures}>
              <button className="text-[13px] text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                Features
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${featuresOpen ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {featuresOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3" style={{ animation: "dropdown-in 150ms ease-out" }}>
                  <div className="w-[620px] rounded-xl border border-zinc-800/60 bg-[#111113]/98 backdrop-blur-xl shadow-2xl flex flex-col">
                    {/* 3-column grid */}
                    <div className="grid grid-cols-3 divide-x divide-zinc-800/40 p-1.5">
                      {featureColumns.map((col) => (
                        <div key={col.heading} className="px-1">
                          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider px-2.5 pt-2 pb-1.5 block">{col.heading}</span>
                          {col.items.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              className="flex flex-col gap-1 px-2.5 py-2 rounded-md hover:bg-white/[0.04] transition-colors group"
                              onClick={() => setFeaturesOpen(false)}
                            >
                              <span className="text-[15px] text-white font-medium">{item.label}</span>
                              <span className="text-[14px] text-zinc-400 group-hover:text-zinc-300 transition-colors leading-snug">{item.desc}</span>
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                    {/* Bottom strip */}
                    <Link
                      to={`/changelog/${latestChangelog.slug}`}
                      className="flex items-center justify-between rounded-b-xl px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
                      onClick={() => setFeaturesOpen(false)}
                    >
                      <span className="text-[14px]"><span className="text-brand font-semibold">New:</span> <span className="text-zinc-300">{latestChangelog.title}</span></span>
                      <span className="text-brand/50 text-[14px]">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <a href="#pricing" className="text-[13px] text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="https://docs.tell.rs" className="text-[13px] text-zinc-400 hover:text-white transition-colors">Docs</a>
            <Link to="/changelog" className="text-[13px] text-zinc-400 hover:text-white transition-colors">Changelog</Link>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
      </div>
    </nav>
    </>
  );
}

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer className={`py-16 px-6 text-zinc-400 border-t ${isHomePage ? "border-zinc-800/40 bg-[#0a0a0b]" : "border-border bg-zinc-900"}`}>
      <div className="max-w-[1340px] mx-auto">
        {isHomePage ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
              <div className="col-span-2 md:col-span-1">
                <span className="text-white font-bold text-lg">Tell</span>
                <p className="text-zinc-600 text-xs mt-2">Analytics platform</p>
              </div>
              <div>
                <h4 className="text-white text-[13px] font-medium mb-4">Product</h4>
                <ul className="space-y-2.5 text-[13px]">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><Link to="/signup" className="hover:text-white transition">Pricing</Link></li>
                  <li><a href="#" className="hover:text-white transition">Connectors</a></li>
                  <li><a href="#" className="hover:text-white transition">Self-host</a></li>
                  <li><Link to="/ot" className="hover:text-white transition">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-[13px] font-medium mb-4">SDKs</h4>
                <ul className="space-y-2.5 text-[13px]">
                  <li><a href="https://github.com/tell-rs/tell-rs" className="hover:text-white transition">Rust</a></li>
                  <li><a href="https://github.com/tell-rs/tell-go" className="hover:text-white transition">Go</a></li>
                  <li><a href="https://github.com/tell-rs/tell-node" className="hover:text-white transition">TypeScript</a></li>
                  <li><a href="https://github.com/tell-rs/tell-swift" className="hover:text-white transition">Swift</a></li>
                  <li><a href="https://github.com/tell-rs/tell-cpp" className="hover:text-white transition">C++</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-800/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-zinc-600">
              <p>© 2026 Tell · Singapore</p>
              <p>Built by the founder of Logpoint</p>
              <a href="https://github.com/tell-rs/" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Tell</span>
                <span className="text-zinc-600">·</span>
                <span className="text-sm">Analytics that tell the whole story</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a href="mailto:hello@tell.rs" className="hover:text-white transition">Contact</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <p>Singapore</p>
              <p className="text-zinc-500">Built by the founder of Logpoint</p>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Page not found</p>
        <Link to="/" className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition">
          Back to Home
        </Link>
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
      <Nav />
      <Outlet />
      <Footer />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={DARK_MODE ? "dark" : ""}>
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

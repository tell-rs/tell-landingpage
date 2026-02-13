/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { TellProvider, useTell } from "@tell-rs/react";

import appCss from "../../styles.css?url";

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
      { rel: "icon", href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function Nav() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full px-4 sm:px-8 py-3 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/90 backdrop-blur-md border-b border-white/5" : "bg-transparent border-b border-transparent"
    }`}>
      <div className="relative flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">Tell</span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-brand/15 text-brand uppercase tracking-wider">
            Alpha
          </span>
        </Link>

        {/* Center nav links - absolutely positioned for true centering, only on homepage */}
        {isHomePage && (
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="#sdks" className="text-sm text-zinc-400 hover:text-white transition-colors">SDKs</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <Link to="/ot" className="text-sm text-zinc-400 hover:text-white transition-colors">OT</Link>
            <a href="https://docs.tell.rs" className="text-sm text-zinc-400 hover:text-white transition-colors">Docs</a>
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
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-zinc-900 text-zinc-400 border-t border-border">
      <div className="max-w-5xl mx-auto">
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
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Track on mount and on path change
    tell.track("Page Viewed", {
      url: window.location.href,
      path: location.pathname,
      referrer: document.referrer,
      title: document.title,
    });
    prevPath.current = location.pathname;
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
        <TellProvider apiKey="00000000000000000000000000000000">
          {children}
          <TellPageTracker />
        </TellProvider>
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../../styles.css?url";

// Theme toggle: set to true for dark mode, false for light mode
const DARK_MODE = true;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tell - Analytics that tell the whole story" },
      { name: "description", content: "Events, logs, business data - one platform. 64M events/sec. One binary. Self-host forever." },
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

  return (
    <nav className="fixed top-0 w-full px-6 sm:px-10 py-5 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
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
            <a href="#pipeline" className="text-sm text-zinc-400 hover:text-white transition-colors">Pipeline</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a
              href="https://github.com/tell-rs/tell#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </a>
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
            Get Started
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
            <a href="https://github.com/tell-rs/tell" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
            <a href="https://github.com/tell-rs/tell#readme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Docs</a>
            <a href="https://github.com/tell-rs/tell/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">License</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>Singapore · Source available</p>
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}

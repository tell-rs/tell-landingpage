/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tell - Analytics that tell the whole story" },
      { name: "description", content: "Events, logs, business data - one platform. 64M events/sec. One binary. Self-host forever." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
      { rel: "icon", href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function Nav() {
  return (
    <nav className="fixed top-0 w-full px-6 sm:px-10 py-5 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm">
      <Link to="/" className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight">Tell</span>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-brand text-white uppercase tracking-wider">
          Alpha
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <a
          href="https://github.com/tell-rs/tell#readme"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-foreground transition font-medium"
        >
          Docs
        </a>
        <a
          href="https://github.com/tell-rs/tell"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-zinc-900 text-zinc-400">
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
        <Link to="/" className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition">
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
    <html lang="en">
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

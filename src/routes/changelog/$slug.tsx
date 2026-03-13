import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getEntryBySlug } from "../../content/changelog";

export const Route = createFileRoute("/changelog/$slug")({
  component: ChangelogEntry,
});

function ChangelogEntry() {
  const { slug } = Route.useParams();
  const entry = getEntryBySlug(slug);

  if (!entry) {
    throw notFound();
  }

  const { Component } = entry;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-[820px] mx-auto">
        <Link
          to="/changelog"
          className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors mb-8 inline-flex items-center gap-1.5"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Changelog
        </Link>

        <article>
          <header className="mb-10">
            <time className="text-[13px] text-zinc-500 mb-3 block">
              {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <h1 className="text-[36px] md:text-[44px] font-semibold tracking-[-0.03em] text-white leading-[1.1] mb-4">
              {entry.title}
            </h1>
            {entry.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] text-zinc-500 bg-zinc-800/60 px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-zinc max-w-none">
            <Component />
          </div>
        </article>
      </div>
    </div>
  );
}

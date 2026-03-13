import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllEntries } from "../../content/changelog";

export const Route = createFileRoute("/changelog/")({
  component: ChangelogPage,
});

function ChangelogPage() {
  const entries = getAllEntries();

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[42px] md:text-[52px] font-semibold tracking-[-0.035em] text-white leading-[1.1] mb-4">
          Changelog
        </h1>
        <p className="text-zinc-400 text-[17px] mb-20">
          New features, improvements, and fixes.
        </p>

        <div className="space-y-0">
          {entries.map((entry, i) => (
            <article
              key={entry.slug}
              id={entry.slug}
              className={`grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 ${
                i > 0 ? "border-t border-zinc-800/50 pt-16 md:pt-20" : ""
              } ${i < entries.length - 1 ? "pb-16 md:pb-20" : ""}`}
            >
              {/* Sticky date column */}
              <div>
                <div className="md:sticky md:top-20">
                  <time className="text-[15px] text-zinc-500 whitespace-nowrap">
                    {new Date(entry.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </time>
                </div>
              </div>

              {/* Content column */}
              <div>
                <Link
                  to="/changelog/$slug"
                  params={{ slug: entry.slug }}
                  className="block"
                >
                  <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.025em] text-white leading-[1.15] mb-6 hover:text-zinc-300 transition-colors">
                    {entry.title}
                  </h2>
                </Link>
                <div className="prose">
                  <entry.Component />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

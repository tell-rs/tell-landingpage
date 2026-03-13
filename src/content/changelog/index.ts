// Vite's import.meta.glob eagerly imports all .mdx files at build time.
// Each module exports { default: MDXComponent, frontmatter: { title, date, tags } }

const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: { title: string; date: string; tags?: string[]; summary?: string };
}>("./*.mdx", { eager: true });

export interface ChangelogEntry {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  Component: React.ComponentType;
}

export function getAllEntries(): ChangelogEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      // path is like "./2026-03-10-wasm-plugin-sdk.mdx"
      const filename = path.replace("./", "").replace(".mdx", "");
      // strip the date prefix to get the slug
      const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");
      return {
        slug,
        title: mod.frontmatter.title,
        date: mod.frontmatter.date,
        tags: mod.frontmatter.tags ?? [],
        summary: mod.frontmatter.summary ?? "",
        Component: mod.default,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first
}

export function getEntryBySlug(slug: string): ChangelogEntry | undefined {
  return getAllEntries().find((e) => e.slug === slug);
}

/** Group entries by "Month YYYY" for the list page */
export function groupByMonth(
  entries: ChangelogEntry[],
): { month: string; entries: ChangelogEntry[] }[] {
  const groups = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    const d = new Date(entry.date + "T00:00:00");
    const key = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups, ([month, entries]) => ({ month, entries }));
}

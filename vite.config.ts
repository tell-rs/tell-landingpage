import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { tellTheme } from "./src/shiki-theme";

export default defineConfig({
  server: {
    port: 3002,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    nitro({
      preset: "vercel",
      scanDirs: ["server"],
      vercel: {
        functions: {
          runtime: "bun1.x",
        },
      },
    }),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [[rehypeShiki, { theme: tellTheme }]],
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
    tailwindcss(),
  ],
});

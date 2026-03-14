# Tell Landing Page

## Tech Stack
- **Runtime**: Bun
- **Framework**: React 19 + TanStack Start (file-based routing via `@tanstack/react-router`)
- **Bundler**: Vite 7 (`@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v4 (inline `@theme`, CSS custom properties)
- **Content**: MDX for changelog entries (remark-frontmatter)
- **Deployment**: Vercel
- **Payments**: Polar (`@polar-sh/tanstack-start`)

## Commands
- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run serve` — preview production build

## Project Structure
- `src/routes/` — file-based routes (TanStack Router)
- `src/components/` — shared React components
- `src/content/changelog/` — MDX changelog entries
- `styles.css` — global styles, CSS variables, font faces

## Design System
- **Brand color**: `#645AE6` (var `--brand`)
- **Fonts**: Space Grotesk (sans), JetBrains Mono (mono)
- **Font scale**: 11px / 13px / 15px / 17px / 24px / 48px / 76px
- **Theme**: Dark-first with CSS custom properties in `:root` / `.dark`

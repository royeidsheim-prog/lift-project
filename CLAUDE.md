# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs-First Rule

Before generating any code, **always read the relevant file(s) in the `/docs` directory first**. These files contain project-specific decisions, patterns, and constraints that must be followed. Do not assume or invent conventions — consult `/docs` before writing any implementation.

- /docs/ui.md

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`, with `@tailwindcss/postcss`
- **Geist fonts** (sans and mono) loaded via `next/font/google`

## Architecture

This is a fresh Next.js App Router project. All routes live under `src/app/`. The path alias `@/*` maps to `./src/*`.

- `src/app/layout.tsx` — root layout with font setup and global metadata
- `src/app/page.tsx` — home page (currently the default create-next-app starter)
- `src/app/globals.css` — global styles with Tailwind v4 import and CSS custom properties for light/dark theme colors (`--background`, `--foreground`)

CSS variables `--background` and `--foreground` are exposed as Tailwind colors via `@theme inline` in `globals.css`. Dark mode is handled via `prefers-color-scheme` media query.

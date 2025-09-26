# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.4 project using React 19.1.0 with TypeScript, Tailwind CSS v4, and Turbopack. The project follows the modern Next.js App Router architecture and uses the latest React features.

## Development Commands

### Primary Development
```bash
# Start development server with Turbopack (default, recommended)
bun dev

# Alternative package managers
npm run dev
yarn dev
pnpm dev
```

### Build and Production
```bash
# Build for production (uses Turbopack)
bun run build

# Start production server
bun run start
```

### Code Quality
```bash
# Run ESLint
bun run lint

# Type checking (via tsc)
npx tsc --noEmit
```

## Architecture

### Directory Structure
- **`src/app/`** - Next.js App Router pages and layouts using the new app directory structure
- **`src/app/layout.tsx`** - Root layout component with font configuration (Geist Sans, Geist Mono)
- **`src/app/page.tsx`** - Home page component  
- **`src/app/globals.css`** - Global styles with Tailwind CSS v4 imports and CSS custom properties
- **`public/`** - Static assets (SVG icons: next.svg, vercel.svg, file.svg, globe.svg, window.svg)

### Key Technologies
- **Next.js 15.5.4** with App Router and Turbopack enabled by default
- **React 19.1.0** with React DOM 19.1.0
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS v4** (latest major version) via PostCSS
- **ESLint 9** with Next.js TypeScript configuration

### Configuration Files
- **`next.config.ts`** - Next.js configuration (currently minimal)
- **`tsconfig.json`** - TypeScript config with path aliases (`@/*` → `./src/*`)
- **`eslint.config.mjs`** - ESLint flat config extending `next/core-web-vitals` and `next/typescript`
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind CSS v4

### Font Configuration
The project uses Next.js font optimization with Google Fonts:
- **Geist Sans** - Primary sans-serif font (`--font-geist-sans`)
- **Geist Mono** - Monospace font for code (`--font-geist-mono`)

### Styling Architecture
- **Tailwind CSS v4** with `@import "tailwindcss"` in globals.css
- **CSS Custom Properties** for theming with light/dark mode support
- **Inline theme configuration** using Tailwind v4's `@theme inline` directive
- **Automatic dark mode** via `prefers-color-scheme` media query

## Development Notes

### Package Manager
This project uses `bun` as evidenced by `bun.lockb`. Commands should prefer `bun` over npm/yarn/pnpm.

### Turbopack
Development and build commands use `--turbopack` flag by default for faster compilation and hot reloading.

### Path Aliases
Use `@/` prefix for imports from the `src/` directory as configured in `tsconfig.json`.

### Component Patterns
The existing codebase follows Next.js 13+ App Router patterns with:
- Server components by default
- Metadata API for SEO
- Image optimization with `next/image`
- Font optimization with `next/font/google`
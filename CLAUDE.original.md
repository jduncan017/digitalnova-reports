# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Next.js + Turbopack)
- `npm run build` — production build
- `npm run check` — lint + typecheck in one step
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run typecheck` — TypeScript only (`tsc --noEmit`)
- `npm run format:check` / `npm run format:write` — Prettier

No test suite exists.

## Architecture

DigitalNova Reports is a **JSON-driven client reporting dashboard** built with Next.js 15 (App Router), React 19, Tailwind CSS 4, and Recharts. Deployed on Vercel. No database — all report data lives in static JSON files.

### Routing

- `/{client}` — client dashboard (trend charts, report history)
- `/{client}/{date}` — individual report page
- `/{client}/login` — client login (password per client)
- `/admin` — admin panel (all clients overview, notify clients)
- `/admin/login` — admin login

### Data Flow

**Client config** is hardcoded in `src/lib/clients.ts` — each client has a slug, name, brand colors, logo, email list, and trend chart configuration. Adding a new client means adding an entry here.

**Report data** lives in `src/data/{client-slug}/{YYYY-MM-DD}.json`. Reports are read from the filesystem at request time (`src/lib/reports.ts`). Adding a new report means dropping a JSON file in the right directory.

**Report type** is defined in `src/lib/types.ts` — the `Report` type drives the entire page. Sections render conditionally based on which fields are present (summary, funnel, charts, videoUrl, growthTrajectory, recommendation, etc.).

### Theming

Per-client brand theming uses CSS custom properties set in `src/app/[client]/layout.tsx`. Components reference `var(--bg)`, `var(--surface)`, `var(--primary)`, `var(--text-heading)`, etc. The `dark` boolean in `ClientBrand` controls light vs dark text/border variants.

### Auth

Cookie-based per-client auth using SHA-256 tokens (`src/lib/auth.ts`). Passwords come from env vars: `CLIENT_PASSWORD_{SLUG}` (slug uppercased, hyphens → underscores). `MASTER_CLIENT_PASSWORD` bypasses per-client passwords. Admin has separate auth (`src/lib/admin-auth.ts`).

### Environment Variables

Validated via `@t3-oss/env-nextjs` in `src/env.js`. Key vars: `RESEND_API_KEY`, `FEEDBACK_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `MASTER_CLIENT_PASSWORD`, plus per-client `CLIENT_PASSWORD_*`.

### Report Components

Report page (`src/app/[client]/[date]/page.tsx`) composes section components conditionally: MetricGrid, FunnelChart, ChartGrid, FindingsGrid, Timeline, NextSteps, VideoEmbed, GrowthTrajectory, RecommendationSection, ReportFeedback. Each component maps directly to a field in the `Report` type.

Weekly vs monthly cadence is auto-detected from report date spacing (>20 days = monthly).

### ESLint

Uses flat config with `typescript-eslint` recommended + type-checked rules. Prefers inline type imports. `consistent-type-definitions` and `array-type` rules are disabled.

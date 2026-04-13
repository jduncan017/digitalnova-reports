# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repo.

## Commands

- `npm run dev` — start dev server (Next.js + Turbopack)
- `npm run build` — production build
- `npm run check` — lint + typecheck in one step
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run typecheck` — TypeScript only (`tsc --noEmit`)
- `npm run format:check` / `npm run format:write` — Prettier

No test suite.

## Architecture

DigitalNova Reports = **JSON-driven client reporting dashboard**. Next.js 15 (App Router), React 19, Tailwind CSS 4, Recharts. Deployed on Vercel. No database — report data in static JSON files.

### Routing

- `/{client}` — client dashboard (trend charts, report history)
- `/{client}/{date}` — individual report page
- `/{client}/login` — client login (password per client)
- `/admin` — admin panel (all clients overview, notify clients)
- `/admin/login` — admin login

### Data Flow

**Client config** hardcoded in `src/lib/clients.ts` — slug, name, brand colors, logo, email list, trend chart config. New client = new entry here.

**Report data** in `src/data/{client-slug}/{YYYY-MM-DD}.json`. Read from filesystem at request time (`src/lib/reports.ts`). New report = drop JSON file in right directory.

**Report type** defined in `src/lib/types.ts` — `Report` type drives entire page. Sections render conditionally based on which fields present (summary, funnel, charts, videoUrl, growthTrajectory, recommendation, etc.).

### Theming

Per-client brand theming via CSS custom properties set in `src/app/[client]/layout.tsx`. Components use `var(--bg)`, `var(--surface)`, `var(--primary)`, `var(--text-heading)`, etc. `dark` boolean in `ClientBrand` controls light vs dark text/border variants.

### Auth

Cookie-based per-client auth, SHA-256 tokens (`src/lib/auth.ts`). Passwords from env vars: `CLIENT_PASSWORD_{SLUG}` (slug uppercased, hyphens → underscores). `MASTER_CLIENT_PASSWORD` bypasses per-client passwords. Admin has separate auth (`src/lib/admin-auth.ts`).

### Environment Variables

Validated via `@t3-oss/env-nextjs` in `src/env.js`. Key vars: `RESEND_API_KEY`, `FEEDBACK_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `MASTER_CLIENT_PASSWORD`, plus per-client `CLIENT_PASSWORD_*`.

### Report Components

Report page (`src/app/[client]/[date]/page.tsx`) composes section components conditionally: MetricGrid, FunnelChart, ChartGrid, FindingsGrid, Timeline, NextSteps, VideoEmbed, GrowthTrajectory, RecommendationSection, ReportFeedback. Each maps to field in `Report` type.

Weekly vs monthly cadence auto-detected from report date spacing (>20 days = monthly).

### ESLint

Flat config with `typescript-eslint` recommended + type-checked rules. Prefers inline type imports. `consistent-type-definitions` and `array-type` rules disabled.
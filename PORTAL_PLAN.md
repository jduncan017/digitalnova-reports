# Phase 1: Client Portal Foundation

## Context
DigitalNova Studio's reporting dashboard needs to evolve into a client portal. Currently it's a static Next.js app with JSON file reports, hardcoded client configs, and simple password auth. Phase 1 adds Supabase (auth + Postgres), an admin dashboard, report upload via JSON, and a richer client dashboard — without changing any existing report rendering components.

## New Dependencies
```
npm install @supabase/supabase-js @supabase/ssr
```

## Route Structure (final)
```
/login                    → Unified login (email + password via Supabase)
/admin                    → Admin overview (clients, stats, recent reports)
/admin/clients            → Client list + management
/admin/clients/new        → Add client form
/admin/clients/[id]/edit  → Edit client form
/admin/reports/upload     → Paste/upload report JSON
/[client]                 → Client dashboard (metrics summary, services, reports list)
/[client]/[date]          → Report view (unchanged rendering)
```

## Database Schema (Supabase Postgres)

**`clients`** — slug (unique), name, logo_url, brand_background, brand_surface, brand_primary, brand_dark, created_at

**`users`** — id (FK to auth.users), role ('admin'|'client'), client_id (FK to clients), display_name, created_at

**`reports`** — id, client_id (FK), date, title, subtitle, period, platform, report_json (JSONB — full Report object), created_at. Unique on (client_id, date).

**`services`** — id, client_id (FK), service_type, status ('active'|'paused'|'completed'), started_at, created_at

RLS enabled on all tables. Admins see everything; clients see only their own data.

Auto-create `users` row on signup via database trigger.

### Schema SQL

```sql
-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Clients table
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  logo_url text,
  brand_background text not null default '#191b1f',
  brand_surface text not null default '#0c0a09',
  brand_primary text not null default '#1d6ee3',
  brand_dark boolean not null default true,
  created_at timestamptz not null default now()
);

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'client')) default 'client',
  client_id uuid references public.clients(id) on delete set null,
  display_name text,
  created_at timestamptz not null default now()
);

-- Reports table
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null,
  title text not null,
  subtitle text,
  period text,
  platform text,
  report_json jsonb not null,
  created_at timestamptz not null default now(),
  unique(client_id, date)
);

-- Services table
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  service_type text not null,
  status text not null check (status in ('active', 'paused', 'completed')) default 'active',
  started_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_reports_client_date on public.reports(client_id, date desc);
create index idx_users_client on public.users(client_id);
create index idx_services_client on public.services(client_id);

-- RLS Policies
alter table public.clients enable row level security;
alter table public.users enable row level security;
alter table public.reports enable row level security;
alter table public.services enable row level security;

-- Admins can see everything
create policy "admins_all_clients" on public.clients
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "clients_own_record" on public.clients
  for select using (
    id in (select client_id from public.users where id = auth.uid())
  );

create policy "admins_all_users" on public.users
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "users_own_profile" on public.users
  for select using (id = auth.uid());

create policy "admins_all_reports" on public.reports
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "clients_own_reports" on public.reports
  for select using (
    client_id in (select client_id from public.users where id = auth.uid())
  );

create policy "admins_all_services" on public.services
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "clients_own_services" on public.services
  for select using (
    client_id in (select client_id from public.users where id = auth.uid())
  );

-- Auto-create users row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, role, display_name)
  values (new.id, 'client', coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Implementation Steps

### Step 1: Supabase Setup
- Create Supabase project
- Run schema SQL above in Supabase SQL editor
- Add env vars to `.env.local` and update `src/env.js`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Supabase Client Utilities (new files)
- `src/lib/supabase/server.ts` — server-side client via `@supabase/ssr` + `cookies()`
- `src/lib/supabase/client.ts` — browser-side client
- `src/lib/supabase/middleware.ts` — middleware client (request/response cookie adapters)
- `src/lib/supabase/admin.ts` — service-role client (bypasses RLS)

### Step 3: Database Query Layer (new files)
- `src/lib/db/clients.ts` — `getClientBySlug()`, `getAllClients()`, `createClient()`, `updateClient()`
- `src/lib/db/reports.ts` — `getReportDates()`, `getReport()`, `createReport()`, `getReportsByClient()`
- `src/lib/db/services.ts` — `getServicesByClient()`, `createService()`, `updateService()`
- `src/lib/db/users.ts` — `getCurrentUser()`, `getUserRole()`, `getUserClient()`

### Step 4: Auth Middleware + Login
- `src/middleware.ts` — refresh Supabase session, protect routes:
  - Unauthenticated → `/login`
  - `/admin/*` requires admin role
  - Public paths: `/login`, `/_next`, `/logos`, static assets
- `src/app/login/page.tsx` — email/password form, redirects by role after login
- `src/app/login/actions.ts` — server action wrapping `supabase.auth.signInWithPassword`
- Rewrite `src/lib/auth.ts` — export Supabase auth helpers (`getUser()`, `isAdmin()`, `signOut()`)
- Delete old `src/app/[client]/login/` directory

### Step 5: Update Existing Routes
- `src/app/page.tsx` — check auth, redirect admin→`/admin`, client→`/[slug]`, unauthed→`/login`
- `src/app/[client]/layout.tsx` — fetch client brand from DB instead of static config. CSS var logic unchanged.
- `src/app/[client]/page.tsx` — fetch reports + services from DB. Add services section + nav stub.
- `src/app/[client]/[date]/page.tsx` — fetch report from DB. All rendering components untouched.
- Keep `getDnLogo()` as a pure utility function

### Step 6: Admin Dashboard (new routes)
- `src/app/admin/layout.tsx` — admin shell with sidebar nav
- `src/app/admin/page.tsx` — overview: client count, report count, services breakdown, recent reports
- `src/app/admin/clients/page.tsx` — client grid/table
- `src/app/admin/clients/new/page.tsx` — add client form (name, slug, brand colors, logo URL)
- `src/app/admin/clients/[id]/edit/page.tsx` — edit client
- `src/app/admin/reports/upload/page.tsx` — JSON paste/upload, client selector, preview, publish
- `src/lib/validators/report.ts` — Zod schema matching the `Report` type for JSON validation

### Step 7: Seed Script + Cleanup
- `scripts/seed.ts` — reads existing `clients.ts` config + JSON files from `src/data/`, inserts into Supabase. Creates admin user + client users.
- Run seed: `npx tsx scripts/seed.ts`
- Delete `src/data/` directory
- Delete `src/lib/clients.ts` (replaced by `src/lib/db/clients.ts`)
- Delete old `src/lib/reports.ts` (replaced by `src/lib/db/reports.ts`)

## Files Modified
- `src/env.js` — add Supabase env vars
- `src/lib/auth.ts` — complete rewrite (Supabase wrappers)
- `src/app/page.tsx` — role-based redirect
- `src/app/[client]/layout.tsx` — DB fetch for client brand
- `src/app/[client]/page.tsx` — DB fetch + services section + nav
- `src/app/[client]/[date]/page.tsx` — DB fetch for report

## Files Created
- `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`, `admin.ts`
- `src/lib/db/clients.ts`, `reports.ts`, `services.ts`, `users.ts`
- `src/lib/validators/report.ts`
- `src/middleware.ts`
- `src/app/login/page.tsx`, `actions.ts`
- `src/app/admin/layout.tsx`, `page.tsx`
- `src/app/admin/clients/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`
- `src/app/admin/reports/upload/page.tsx`
- `scripts/seed.ts`

## Files Deleted
- `src/app/[client]/login/page.tsx`, `actions.ts`
- `src/lib/clients.ts` (after seeding)
- `src/lib/reports.ts` (after seeding)
- `src/data/` directory (after seeding)

## NOT Changed (preserved exactly)
- All report rendering components (MetricCard, MetricGrid, FunnelChart, BarChartCard, DoughnutChartCard, FindingsGrid, Timeline, NextSteps, VideoEmbed, SectionHeader, ChartGrid)
- ReportHeader, ReportFooter
- LoginForm component (will be adapted for email+password instead of just password)
- `src/lib/types.ts` (Report type definition)
- CSS custom property theming system
- Tailwind/styling setup

## Verification
1. Run `npm run dev`, visit `/login` — should see email/password login
2. Log in as admin → redirected to `/admin` with client overview
3. Navigate to `/admin/reports/upload` → paste a report JSON, select client, publish
4. Navigate to `/admin/clients/new` → create a client with brand colors
5. Log in as client user → redirected to `/[client]` dashboard with services + reports
6. Click a report → same rendered view as before, data from Supabase
7. Run seed script and verify all 3 existing clients + reports migrated correctly

## Future Phases
- **Phase 2**: n8n integration (automation activity feed), Stripe integration (invoice history in portal), automated report generation via n8n + ad platform APIs
- **Phase 3**: File uploads, onboarding (integrate agency-forms), feedback collection, subscription management
- **Long-term**: Multi-tenant SaaS for other agencies

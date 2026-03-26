# PolicyLedger MVP

PolicyLedger is a lightweight audit-ready record system for small teams.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS + reusable UI primitives
- Prisma + PostgreSQL
- Auth.js (NextAuth credentials for local MVP)

## Setup
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Install deps:
   ```bash
   npm install
   ```
3. Generate Prisma client and migrate:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. Seed sample data:
   ```bash
   npm run db:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Auth (local MVP)
Use `/login` and choose one seeded user:
- admin@acme.local
- manager@acme.local
- member@acme.local
- viewer@acme.local

## Main routes
- Public: `/`, `/pricing`, `/login`
- App: `/app/dashboard`, `/app/policies`, `/app/approvals`, `/app/acknowledgements`, `/app/incidents`, `/app/reports`, `/app/users`, `/app/settings`

## Reliability notes
- Every app query and mutation is workspace-scoped.
- Mutations in server actions write to `ActivityLog`.
- Core RBAC checks are server-side (`src/lib/permissions.ts`).

## MVP gaps remaining
- File upload backend for attachments currently placeholder URLs.
- Toast notifications are not wired yet.
- Invite workflow is placeholder text in Users screen.
- Some detail mutations (e.g. incident close flow, policy version creation UI) are read-only in this iteration.

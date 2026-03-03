# Starlight Barbershop

Modern dark-mode booking experience for **Starlight Barbershop** (Δημήτρης Λεοντακιανάκης) με neon cyan + warm white accents και πλήρη διαχείριση.

## Stack
- Next.js (App Router) + TypeScript
- TailwindCSS + custom neon/arch styling
- Prisma ORM with SQLite (dev) / Postgres-ready via `DATABASE_URL`
- NextAuth (credentials) with bcrypt-hashed admin user
- Zod validation, date-fns for scheduling

## Quickstart
```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for admin.

## Environment
- `DATABASE_URL` – SQLite or Postgres connection string
- `NEXTAUTH_SECRET` – secure random string
- `NEXTAUTH_URL` – public app URL
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – seed admin credentials
- `BUSINESS_TIMEZONE` – defaults to `America/New_York`

## Features
- Public booking with availability respecting lead time, 30-day window, business hours, blocked times, and no double-booking.
- Confirmation code + cancel token link for self-management (`/manage` or `/a/[token]`).
- Customer reviews submission + admin moderation (approved reviews surface on the site).
- Admin dashboard with appointment status updates, service CRUD, block scheduling, reviews moderation, and CSV export.
- Design language: charcoal background, neon cyan glow, warm white accents, emerald highlights, hex pattern background, LED arch glow, and “Από το 2025” branding.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – lint
- `npm run prisma:migrate` – interactive migrations
- `npm run prisma:studio` – open Prisma Studio
- `npm run prisma:seed` – seed database

- Apo npx run npx prisma generate

## Database
Times are stored in UTC. Business timezone defaults to America/New_York and can be changed via env. Business rules live in `lib/config.ts`.

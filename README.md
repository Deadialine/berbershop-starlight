# Starlight Barbershop

Next.js App Router + TypeScript + Tailwind booking app with local SQLite persistence (no Prisma).

## Quickstart (Windows PowerShell)
```powershell
cd .\berbershop-starlight
npm install
copy .env.example .env
npm run db:init
npm run db:seed
npm run dev
```

## Quickstart (macOS/Linux)
```bash
cd /workspace/berbershop-starlight
npm install
cp .env.example .env
npm run db:init
npm run db:seed
npm run dev
```

Open:
- http://localhost:3000
- http://localhost:3000/admin/login

Admin credentials:
- username: `admin`
- password: `admin`

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run db:init`
- `npm run db:seed`

# Deployment Guide

## 1) Local development
```bash
npm install
cp .env.example .env
npm run db:init
npm run db:seed
npm run dev
```

## 2) Production run
```bash
npm install
npm run db:init
npm run db:seed
npm run build
npm run start
```

## 3) Run as a service

### Linux (systemd)
Create `/etc/systemd/system/starlight.service`:
```ini
[Unit]
Description=Starlight Barbershop
After=network.target

[Service]
WorkingDirectory=/opt/berbershop-starlight
ExecStart=/usr/bin/npm run start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```
Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now starlight
```

### Windows
Use Task Scheduler or NSSM to run `npm run start` in the project directory after boot.

## 4) Domain + HTTPS
Recommended registrars: Cloudflare Registrar or Namecheap.

1. Buy domain (example: `starlightbarbershop.gr`).
2. Add DNS **A** record to your server public IP.
3. Use reverse proxy Caddy for auto HTTPS.

Example `Caddyfile`:
```caddy
starlightbarbershop.gr {
  reverse_proxy 127.0.0.1:3000
}
```
Run Caddy and certificates are auto-managed.

## 5) Hosting from home
- Router port forward: external 80/443 to your machine.
- Ensure static/public IP or dynamic DNS.
- If this is difficult, use a low-cost VPS ($5–$10/month).

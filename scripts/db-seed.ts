import { initDb, getDb, newId, nowIso } from "../lib/db";

initDb();
const db = getDb();

const services = [
  { name: "Classic Cut", duration: 30, price: "€15" },
  { name: "Fade + Beard", duration: 45, price: "€20" },
  { name: "Deluxe Grooming", duration: 60, price: "€28" },
];

const insert = db.prepare(`
  INSERT INTO services (id, name, duration_minutes, price_text, is_active, created_at)
  VALUES (?, ?, ?, ?, 1, ?)
`);

for (const service of services) {
  const exists = db.prepare("SELECT id FROM services WHERE name = ?").get(service.name);
  if (!exists) {
    insert.run(newId(), service.name, service.duration, service.price, nowIso());
  }
}

console.log("Database seeded.");

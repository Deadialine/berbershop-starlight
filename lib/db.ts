import { mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { DatabaseSync } from "node:sqlite";

const dataDir = join(process.cwd(), "data");
const dbPath = join(dataDir, "starlight.db");

export type AppointmentStatus = "BOOKED" | "CANCELLED" | "COMPLETED" | "NOSHOW";

let database: DatabaseSync | null = null;

export function getDb() {
  if (!database) {
    mkdirSync(dataDir, { recursive: true });
    database = new DatabaseSync(dbPath);
    database.exec("PRAGMA journal_mode = WAL;");
    database.exec("PRAGMA foreign_keys = ON;");
  }
  return database;
}

export function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      price_text TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      start_utc TEXT NOT NULL,
      end_utc TEXT NOT NULL,
      status TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      user_id TEXT,
      confirmation_code TEXT NOT NULL UNIQUE,
      manage_token TEXT NOT NULL UNIQUE,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(service_id) REFERENCES services(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      start_utc TEXT NOT NULL,
      end_utc TEXT NOT NULL,
      reason TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      status TEXT NOT NULL,
      appointment_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(start_utc, end_utc, status);
    CREATE INDEX IF NOT EXISTS idx_blocks_time ON blocks(start_utc, end_utc);
  `);
}

export const newId = () => randomUUID();
export const nowIso = () => new Date().toISOString();

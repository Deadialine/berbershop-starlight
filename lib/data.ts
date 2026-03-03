import { AppointmentStatus, getDb, initDb, newId, nowIso } from "./db";

initDb();

type SqlValue = string | number | null;

export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceText: string;
  isActive: boolean;
  createdAt: string;
};

export type Appointment = {
  id: string;
  serviceId: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  userId: string | null;
  confirmationCode: string;
  cancelToken: string;
  note: string | null;
  createdAt: string;
};

const activeStatuses = ["BOOKED", "COMPLETED", "NOSHOW"];

const mapService = (row: any): Service => ({
  id: row.id,
  name: row.name,
  durationMinutes: row.duration_minutes,
  priceText: row.price_text,
  isActive: !!row.is_active,
  createdAt: row.created_at,
});

const mapAppointment = (row: any): Appointment => ({
  id: row.id,
  serviceId: row.service_id,
  startAt: row.start_utc,
  endAt: row.end_utc,
  status: row.status,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
  userId: row.user_id,
  confirmationCode: row.confirmation_code,
  cancelToken: row.manage_token,
  note: row.note,
  createdAt: row.created_at,
});

function withService(row: any) {
  return {
    ...mapAppointment(row),
    service: row.service_name ? { name: row.service_name } : null,
  };
}

function hasConflict(startAt: string, endAt: string, excludeId?: string) {
  const db = getDb();
  const params: SqlValue[] = [endAt, startAt];
  let appointmentSql = `
    SELECT id FROM appointments
    WHERE status IN (${activeStatuses.map(() => "?").join(",")})
      AND start_utc < ?
      AND end_utc > ?
  `;
  const appointmentParams: SqlValue[] = [...activeStatuses, ...params];
  if (excludeId) {
    appointmentSql += " AND id != ?";
    appointmentParams.push(excludeId);
  }
  appointmentSql += " LIMIT 1";

  const appointmentConflict = db.prepare(appointmentSql).get(...appointmentParams);
  if (appointmentConflict) return true;

  const blockConflict = db
    .prepare("SELECT id FROM blocks WHERE start_utc < ? AND end_utc > ? LIMIT 1")
    .get(endAt, startAt);
  return !!blockConflict;
}

function runInImmediateTransaction<T>(fn: () => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export const dbx = {
  listServices(activeOnly = false) {
    const rows = getDb()
      .prepare(`SELECT * FROM services ${activeOnly ? "WHERE is_active = 1" : ""} ORDER BY name ASC`)
      .all();
    return rows.map(mapService);
  },

  getServiceById(id: string) {
    const row = getDb().prepare("SELECT * FROM services WHERE id = ?").get(id);
    return row ? mapService(row) : null;
  },

  createService(input: { name: string; durationMinutes: number; priceText: string; isActive?: boolean }) {
    const id = newId();
    getDb()
      .prepare(
        "INSERT INTO services (id, name, duration_minutes, price_text, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(id, input.name, input.durationMinutes, input.priceText, input.isActive === false ? 0 : 1, nowIso());
    return this.getServiceById(id)!;
  },

  updateService(id: string, input: { name: string; durationMinutes: number; priceText: string; isActive?: boolean }) {
    getDb()
      .prepare("UPDATE services SET name = ?, duration_minutes = ?, price_text = ?, is_active = ? WHERE id = ?")
      .run(input.name, input.durationMinutes, input.priceText, input.isActive === false ? 0 : 1, id);
    return this.getServiceById(id);
  },

  deleteService(id: string) {
    getDb().prepare("DELETE FROM services WHERE id = ?").run(id);
  },

  listAppointments() {
    const rows = getDb()
      .prepare(
        `SELECT a.*, s.name AS service_name
         FROM appointments a
         LEFT JOIN services s ON s.id = a.service_id
         ORDER BY a.start_utc ASC`
      )
      .all();
    return rows.map(withService);
  },

  getAppointmentById(id: string) {
    const row = getDb().prepare("SELECT * FROM appointments WHERE id = ?").get(id);
    return row ? mapAppointment(row) : null;
  },

  getAppointmentByToken(token: string) {
    const row = getDb()
      .prepare(
        `SELECT a.*, s.name AS service_name
         FROM appointments a
         LEFT JOIN services s ON s.id = a.service_id
         WHERE a.manage_token = ?`
      )
      .get(token);
    return row ? withService(row) : null;
  },

  lookupAppointment(code: string, phone?: string) {
    const row = phone
      ? getDb()
          .prepare(
            `SELECT a.*, s.name AS service_name
             FROM appointments a
             LEFT JOIN services s ON s.id = a.service_id
             WHERE a.confirmation_code = ? AND a.customer_phone = ?`
          )
          .get(code, phone)
      : getDb()
          .prepare(
            `SELECT a.*, s.name AS service_name
             FROM appointments a
             LEFT JOIN services s ON s.id = a.service_id
             WHERE a.confirmation_code = ?`
          )
          .get(code);
    return row ? withService(row) : null;
  },

  createAppointment(input: Omit<Appointment, "id" | "createdAt">) {
    return runInImmediateTransaction(() => {
      if (hasConflict(input.startAt, input.endAt)) {
        throw new Error("CONFLICT");
      }
      const id = newId();
      getDb()
        .prepare(
          `INSERT INTO appointments
          (id, service_id, start_utc, end_utc, status, customer_name, customer_email, customer_phone, user_id, confirmation_code, manage_token, note, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          id,
          input.serviceId,
          input.startAt,
          input.endAt,
          input.status,
          input.customerName,
          input.customerEmail,
          input.customerPhone,
          input.userId,
          input.confirmationCode,
          input.cancelToken,
          input.note,
          nowIso()
        );
      return this.getAppointmentById(id)!;
    });
  },

  updateAppointment(id: string, patch: Partial<Appointment>) {
    return runInImmediateTransaction(() => {
      const current = this.getAppointmentById(id);
      if (!current) return null;
      const next = { ...current, ...patch };
      if (hasConflict(next.startAt, next.endAt, id)) {
        throw new Error("CONFLICT");
      }
      getDb()
        .prepare(
          `UPDATE appointments
           SET service_id = ?, start_utc = ?, end_utc = ?, status = ?, customer_name = ?, customer_email = ?, customer_phone = ?, user_id = ?, note = ?
           WHERE id = ?`
        )
        .run(
          next.serviceId,
          next.startAt,
          next.endAt,
          next.status,
          next.customerName,
          next.customerEmail,
          next.customerPhone,
          next.userId,
          next.note,
          id
        );
      return this.getAppointmentById(id);
    });
  },

  deleteAppointment(id: string) {
    getDb().prepare("DELETE FROM appointments WHERE id = ?").run(id);
  },

  listBlocks() {
    return getDb()
      .prepare("SELECT * FROM blocks ORDER BY start_utc ASC")
      .all()
      .map((row: any) => ({ id: row.id, startAt: row.start_utc, endAt: row.end_utc, reason: row.reason, createdAt: row.created_at }));
  },

  createBlock(input: { startAt: string; endAt: string; reason?: string }) {
    const id = newId();
    getDb()
      .prepare("INSERT INTO blocks (id, start_utc, end_utc, reason, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(id, input.startAt, input.endAt, input.reason || null, nowIso());
    return { id, ...input };
  },

  updateBlock(id: string, input: { startAt: string; endAt: string; reason?: string }) {
    getDb().prepare("UPDATE blocks SET start_utc = ?, end_utc = ?, reason = ? WHERE id = ?").run(input.startAt, input.endAt, input.reason || null, id);
    return { id, ...input };
  },

  deleteBlock(id: string) {
    getDb().prepare("DELETE FROM blocks WHERE id = ?").run(id);
  },

  listReviews(approvedOnly = false) {
    const rows = getDb()
      .prepare(`SELECT * FROM reviews ${approvedOnly ? "WHERE status = 'APPROVED'" : ""} ORDER BY created_at DESC`)
      .all();
    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      comment: row.comment,
      status: row.status,
      appointmentId: row.appointment_id,
      createdAt: row.created_at,
    }));
  },

  createReview(input: { name: string; rating: number; comment: string; appointmentId?: string; status: string }) {
    const id = newId();
    getDb()
      .prepare("INSERT INTO reviews (id, name, rating, comment, status, appointment_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, input.name, input.rating, input.comment, input.status, input.appointmentId || null, nowIso());
    return { id, ...input };
  },

  updateReviewStatus(id: string, status: string) {
    getDb().prepare("UPDATE reviews SET status = ? WHERE id = ?").run(status, id);
  },

  deleteReview(id: string) {
    getDb().prepare("DELETE FROM reviews WHERE id = ?").run(id);
  },

  getUserByEmail(email: string) {
    return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email);
  },

  createUser(email: string, passwordHash: string) {
    const id = newId();
    getDb().prepare("INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)").run(id, email, passwordHash, nowIso());
    return { id, email };
  },

  listUserAppointments(userId: string) {
    const rows = getDb()
      .prepare(
        `SELECT a.*, s.name AS service_name
         FROM appointments a
         LEFT JOIN services s ON s.id = a.service_id
         WHERE a.user_id = ?
         ORDER BY a.start_utc DESC`
      )
      .all(userId);
    return rows.map(withService);
  },

  hasConflictingAppointment(startAt: string, endAt: string, excludeId?: string) {
    return hasConflict(startAt, endAt, excludeId);
  },
};

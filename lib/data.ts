import { getDb, initDb, newId, nowIso, AppointmentStatus } from "./db";

initDb();

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

function mapService(row: any): Service {
  return {
    id: row.id,
    name: row.name,
    durationMinutes: row.duration_minutes,
    priceText: row.price_text,
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
}

function mapAppointment(row: any): Appointment {
  return {
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
  };
}

export const dbx = {
  listServices(activeOnly = false) {
    const db = getDb();
    const rows = db
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
      .prepare("UPDATE services SET name=?, duration_minutes=?, price_text=?, is_active=? WHERE id=?")
      .run(input.name, input.durationMinutes, input.priceText, input.isActive === false ? 0 : 1, id);
    return this.getServiceById(id);
  },
  deleteService(id: string) {
    getDb().prepare("DELETE FROM services WHERE id = ?").run(id);
  },
  listAppointments() {
    const rows = getDb()
      .prepare(
        `SELECT a.*, s.name as service_name FROM appointments a LEFT JOIN services s ON s.id = a.service_id ORDER BY start_utc ASC`
      )
      .all();
    return rows.map((r: any) => ({ ...mapAppointment(r), service: r.service_name ? { name: r.service_name } : null }));
  },
  getAppointmentById(id: string) {
    const row = getDb().prepare("SELECT * FROM appointments WHERE id = ?").get(id);
    return row ? mapAppointment(row) : null;
  },
  getAppointmentByToken(token: string) {
    const row = getDb()
      .prepare(
        `SELECT a.*, s.name as service_name FROM appointments a LEFT JOIN services s ON s.id=a.service_id WHERE a.manage_token = ?`
      )
      .get(token);
    return row ? { ...mapAppointment(row), service: row.service_name ? { name: row.service_name } : null } : null;
  },
  lookupAppointment(code: string, phone?: string) {
    const row = phone
      ? getDb()
          .prepare(
            `SELECT a.*, s.name as service_name FROM appointments a LEFT JOIN services s ON s.id=a.service_id WHERE a.confirmation_code=? AND a.customer_phone=?`
          )
          .get(code, phone)
      : getDb()
          .prepare(
            `SELECT a.*, s.name as service_name FROM appointments a LEFT JOIN services s ON s.id=a.service_id WHERE a.confirmation_code=?`
          )
          .get(code);
    return row ? { ...mapAppointment(row), service: row.service_name ? { name: row.service_name } : null } : null;
  },
  createAppointment(input: Omit<Appointment, "id" | "createdAt">) {
    const id = newId();
    getDb()
      .prepare(
        `INSERT INTO appointments (id, service_id, start_utc, end_utc, status, customer_name, customer_email, customer_phone, user_id, confirmation_code, manage_token, note, created_at)
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
  },
  updateAppointment(id: string, patch: Partial<Appointment>) {
    const current = this.getAppointmentById(id);
    if (!current) return null;
    const next = { ...current, ...patch };
    getDb()
      .prepare(
        `UPDATE appointments SET service_id=?, start_utc=?, end_utc=?, status=?, customer_name=?, customer_email=?, customer_phone=?, user_id=?, note=? WHERE id=?`
      )
      .run(next.serviceId, next.startAt, next.endAt, next.status, next.customerName, next.customerEmail, next.customerPhone, next.userId, next.note, id);
    return this.getAppointmentById(id);
  },
  deleteAppointment(id: string) { getDb().prepare("DELETE FROM appointments WHERE id=?").run(id); },
  listBlocks() { return getDb().prepare("SELECT * FROM blocks ORDER BY start_utc ASC").all().map((b:any)=>({id:b.id,startAt:b.start_utc,endAt:b.end_utc,reason:b.reason,createdAt:b.created_at})); },
  createBlock(input:{startAt:string;endAt:string;reason?:string}){const id=newId();getDb().prepare("INSERT INTO blocks (id,start_utc,end_utc,reason,created_at) VALUES (?,?,?,?,?)").run(id,input.startAt,input.endAt,input.reason||null,nowIso());return {id,...input};},
  updateBlock(id:string,input:{startAt:string;endAt:string;reason?:string}){getDb().prepare("UPDATE blocks SET start_utc=?, end_utc=?, reason=? WHERE id=?").run(input.startAt,input.endAt,input.reason||null,id);return {id,...input};},
  deleteBlock(id:string){getDb().prepare("DELETE FROM blocks WHERE id=?").run(id);},
  listReviews(approvedOnly=false){const rows=getDb().prepare(`SELECT * FROM reviews ${approvedOnly?"WHERE status='APPROVED'":""} ORDER BY created_at DESC`).all();return rows.map((r:any)=>({id:r.id,name:r.name,rating:r.rating,comment:r.comment,status:r.status,appointmentId:r.appointment_id,createdAt:r.created_at}));},
  createReview(input:{name:string;rating:number;comment:string;appointmentId?:string;status:string}){const id=newId();getDb().prepare("INSERT INTO reviews (id,name,rating,comment,status,appointment_id,created_at) VALUES (?,?,?,?,?,?,?)").run(id,input.name,input.rating,input.comment,input.status,input.appointmentId||null,nowIso());return {id,...input};},
  updateReviewStatus(id:string,status:string){getDb().prepare("UPDATE reviews SET status=? WHERE id=?").run(status,id);},
  deleteReview(id:string){getDb().prepare("DELETE FROM reviews WHERE id=?").run(id);},
  getUserByEmail(email:string){return getDb().prepare("SELECT * FROM users WHERE email=?").get(email);},
  createUser(email:string,passwordHash:string){const id=newId();getDb().prepare("INSERT INTO users (id,email,password_hash,created_at) VALUES (?,?,?,?)").run(id,email,passwordHash,nowIso());return {id,email};},
  listUserAppointments(userId:string){const rows=getDb().prepare("SELECT a.*, s.name as service_name FROM appointments a LEFT JOIN services s ON s.id=a.service_id WHERE user_id=? ORDER BY start_utc DESC").all(userId);return rows.map((r:any)=>({...mapAppointment(r),service:r.service_name?{name:r.service_name}:null}));},
  hasConflictingAppointment(startAt:string,endAt:string,excludeId?:string){
    const row = excludeId
      ? getDb().prepare("SELECT id FROM appointments WHERE id != ? AND status IN ('BOOKED','COMPLETED','NOSHOW') AND start_utc < ? AND end_utc > ? LIMIT 1").get(excludeId,endAt,startAt)
      : getDb().prepare("SELECT id FROM appointments WHERE status IN ('BOOKED','COMPLETED','NOSHOW') AND start_utc < ? AND end_utc > ? LIMIT 1").get(endAt,startAt);
    if (row) return true;
    const block = getDb().prepare("SELECT id FROM blocks WHERE start_utc < ? AND end_utc > ? LIMIT 1").get(endAt,startAt);
    return !!block;
  }
};

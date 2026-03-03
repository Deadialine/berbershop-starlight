import { NextRequest, NextResponse } from "next/server";
import { appointmentAdminSchema } from "@/lib/validation";
import { randomBytes } from "crypto";
import { requireAdmin } from "@/lib/admin";
import { dbx } from "@/lib/data";

const code = () => randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
const token = () => randomBytes(24).toString("hex");

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const all = dbx.listAppointments();
  const sp = new URL(req.url).searchParams;
  const q = (sp.get("q") || "").toLowerCase();
  const status = sp.get("status");
  const serviceId = sp.get("serviceId");
  const from = sp.get("from"); const to = sp.get("to");
  const filtered = all.filter((a:any)=>{
    if (status && a.status !== status) return false;
    if (serviceId && a.serviceId !== serviceId) return false;
    if (from && a.startAt < from) return false;
    if (to && a.startAt > to) return false;
    if (q && ![a.customerName,a.customerPhone,a.customerEmail].filter(Boolean).join(" ").toLowerCase().includes(q)) return false;
    return true;
  });
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const parsed = appointmentAdminSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  if (dbx.hasConflictingAppointment(data.startAt, data.endAt)) return NextResponse.json({ error: "Conflicting appointment" }, { status: 409 });
  return NextResponse.json(dbx.createAppointment({ ...data, customerEmail: data.customerEmail || null, note: data.note || null, userId: null, confirmationCode: code(), cancelToken: token() }));
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const parsed = appointmentAdminSchema.safeParse(await req.json());
  if (!parsed.success || !parsed.data.id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id, ...rest } = parsed.data;
  if (dbx.hasConflictingAppointment(rest.startAt, rest.endAt, id)) return NextResponse.json({ error: "Conflicting appointment" }, { status: 409 });
  return NextResponse.json(dbx.updateAppointment(id, { ...rest, customerEmail: rest.customerEmail || null, note: rest.note || null }));
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  dbx.deleteAppointment(id);
  return NextResponse.json({ ok: true });
}

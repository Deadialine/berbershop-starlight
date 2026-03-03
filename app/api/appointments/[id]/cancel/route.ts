import { NextRequest, NextResponse } from "next/server";
import { dbx } from "@/lib/data";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { code, token } = (await req.json()) ?? {};
  const appointment = dbx.getAppointmentById(params.id);
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const authorized = (code && appointment.confirmationCode === code.toUpperCase()) || (token && appointment.cancelToken === token);
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const updated = dbx.updateAppointment(params.id, { status: "CANCELLED" });
  return NextResponse.json({ appointment: updated });
}

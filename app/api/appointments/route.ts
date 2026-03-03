import { NextRequest, NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validation";
import { randomBytes } from "crypto";
import { addMinutes, isBefore } from "date-fns";
import { getAvailableSlots } from "@/lib/slots";
import { dbx } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function generateToken() {
  return randomBytes(24).toString("hex");
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = appointmentSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;

  const service = dbx.getServiceById(data.serviceId);
  if (!service || !service.isActive) return NextResponse.json({ error: "Service unavailable" }, { status: 404 });

  const slotStart = new Date(data.slotStart);
  const slotEnd = addMinutes(slotStart, service.durationMinutes);
  const slots = await getAvailableSlots(data.slotStart.slice(0, 10), service.durationMinutes);
  const slotAllowed = slots.some((slot) => new Date(slot.start).getTime() === slotStart.getTime());
  if (!slotAllowed) return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });
  if (isBefore(slotEnd, slotStart)) return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  if (!data.customerEmail && !data.customerPhone) return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.role === "guest" ? (session?.user as any).id : null;

  if (dbx.hasConflictingAppointment(slotStart.toISOString(), slotEnd.toISOString())) {
    return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });
  }

  const appointment = dbx.createAppointment({
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail || null,
    note: data.note || null,
    startAt: slotStart.toISOString(),
    endAt: slotEnd.toISOString(),
    serviceId: data.serviceId,
    confirmationCode: generateCode(),
    cancelToken: generateToken(),
    userId,
    status: "BOOKED",
  });

  return NextResponse.json({ appointment: { ...appointment, service } });
}

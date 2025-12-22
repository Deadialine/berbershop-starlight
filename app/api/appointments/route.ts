import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validation";
import { randomBytes } from "crypto";
import { addMinutes, isBefore } from "date-fns";
import { getAvailableSlots } from "@/lib/slots";

function generateCode() {
  return randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
}

function generateToken() {
  return randomBytes(12).toString("hex");
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = appointmentSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;

  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service || !service.isActive) return NextResponse.json({ error: "Service unavailable" }, { status: 404 });

  const slotStart = new Date(data.slotStart);
  const slotEnd = addMinutes(slotStart, service.durationMinutes);

  const slots = await getAvailableSlots(data.slotStart.slice(0, 10), service.durationMinutes);
  const slotAllowed = slots.some((slot) => new Date(slot.start).getTime() === slotStart.getTime());
  if (!slotAllowed) return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });

  if (isBefore(slotEnd, slotStart)) return NextResponse.json({ error: "Invalid time" }, { status: 400 });

  const appointment = await prisma.appointment.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      note: data.note,
      startAt: slotStart,
      endAt: slotEnd,
      serviceId: data.serviceId,
      confirmationCode: generateCode(),
      cancelToken: generateToken(),
    },
    include: { service: true },
  });

  return NextResponse.json({ appointment });
}

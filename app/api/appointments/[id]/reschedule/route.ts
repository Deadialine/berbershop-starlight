import { NextRequest, NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { z } from "zod";
import { dbx } from "@/lib/data";

const schema = z.object({
  slotStart: z.string().min(1),
  code: z.string().optional(),
  token: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const appointment = dbx.getAppointmentById(params.id);
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const authorized =
    (parsed.data.code && appointment.confirmationCode === parsed.data.code.toUpperCase()) ||
    (parsed.data.token && appointment.cancelToken === parsed.data.token);

  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const service = dbx.getServiceById(appointment.serviceId);
  if (!service) return NextResponse.json({ error: "Service unavailable" }, { status: 404 });

  const start = new Date(parsed.data.slotStart);
  const end = addMinutes(start, service.durationMinutes);

  try {
    const updated = dbx.updateAppointment(appointment.id, {
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      status: "BOOKED",
    });
    return NextResponse.json({ appointment: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "CONFLICT") {
      return NextResponse.json({ error: "Selected slot is not available" }, { status: 409 });
    }
    throw error;
  }
}

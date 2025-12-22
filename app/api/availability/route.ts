import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  if (!serviceId || !date) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const slots = await getAvailableSlots(date, service.durationMinutes);
  return NextResponse.json(slots);
}

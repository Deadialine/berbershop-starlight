import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";
import { dbx } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  if (!serviceId || !date) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const service = dbx.getServiceById(serviceId);
  if (!service || !service.isActive) return NextResponse.json({ error: "Service not found" }, { status: 404 });
  return NextResponse.json(await getAvailableSlots(date, service.durationMinutes));
}

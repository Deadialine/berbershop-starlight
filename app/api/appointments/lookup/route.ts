import { NextRequest, NextResponse } from "next/server";
import { lookupSchema } from "@/lib/validation";
import { allowRequest } from "@/lib/rate-limit";
import { dbx } from "@/lib/data";

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "anon";
  if (!allowRequest(`lookup-${ip}`)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const parsed = lookupSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { code, phone } = parsed.data;
  const appointment = dbx.lookupAppointment(code.toUpperCase(), phone);
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ appointment });
}

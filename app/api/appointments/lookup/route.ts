import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { lookupSchema } from "@/lib/validation";
import { allowRequest } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "anon";
  if (!allowRequest(`lookup-${ip}`)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const body = await req.json();
  const parsed = lookupSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { code, phone } = parsed.data;
  const appointment = await prisma.appointment.findFirst({
    where: {
      confirmationCode: code.toUpperCase(),
      ...(phone ? { customerPhone: phone } : {}),
    },
    include: { service: true },
  });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ appointment });
}

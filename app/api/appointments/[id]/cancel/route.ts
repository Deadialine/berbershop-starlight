import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { code, token } = body ?? {};
  const appointment = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const authorized =
    (code && appointment.confirmationCode === code.toUpperCase()) ||
    (token && appointment.cancelToken === token);
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data: { status: "CANCELLED" },
  });
  return NextResponse.json({ appointment: updated });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appointmentAdminSchema } from "@/lib/validation";
import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function randomCode() {
  return randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
}
function randomToken() {
  return randomBytes(12).toString("hex");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate) return gate;
  const appointments = await prisma.appointment.findMany({
    include: { service: true },
    orderBy: { startAt: "asc" },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const parsed = appointmentAdminSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const created = await prisma.appointment.create({
    data: {
      ...data,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      confirmationCode: randomCode(),
      cancelToken: randomToken(),
    },
  });
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const parsed = appointmentAdminSchema.safeParse(body);
  if (!parsed.success || !parsed.data.id)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id, ...rest } = parsed.data;
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      ...rest,
      customerEmail: rest.customerEmail || null,
      note: rest.note || null,
      startAt: new Date(rest.startAt),
      endAt: new Date(rest.endAt),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

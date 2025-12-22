import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminServiceSchema } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate) return gate;
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const parsed = adminServiceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const service = await prisma.service.create({ data: { ...parsed.data, isActive: parsed.data.isActive ?? true } });
  return NextResponse.json(service);
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const parsed = adminServiceSchema.safeParse(body);
  if (!parsed.success || !parsed.data.id)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id, ...data } = parsed.data;
  const service = await prisma.service.update({ where: { id }, data });
  return NextResponse.json(service);
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

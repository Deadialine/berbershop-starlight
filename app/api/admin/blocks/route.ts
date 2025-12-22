import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blockSchema } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate) return gate;
  const blocks = await prisma.blockedTime.findMany({ orderBy: { startAt: "asc" } });
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const parsed = blockSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const block = await prisma.blockedTime.create({
    data: {
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      reason: data.reason,
    },
  });
  return NextResponse.json(block);
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const parsed = blockSchema.safeParse(body);
  if (!parsed.success || !parsed.data.id)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id, ...rest } = parsed.data;
  const block = await prisma.blockedTime.update({
    where: { id },
    data: { ...rest, startAt: new Date(rest.startAt), endAt: new Date(rest.endAt) },
  });
  return NextResponse.json(block);
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.blockedTime.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

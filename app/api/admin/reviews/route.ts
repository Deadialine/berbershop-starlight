import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { reviewSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate) return gate;
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const review = await prisma.review.create({ data: { ...parsed.data, status: "APPROVED" } });
  return NextResponse.json(review);
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const body = await req.json();
  const { id, status } = body ?? {};
  if (!id || !status) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const updated = await prisma.review.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin();
  if (gate) return gate;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

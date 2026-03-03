import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { reviewSchema } from "@/lib/validation";
import { dbx } from "@/lib/data";

export async function GET() { const gate = await requireAdmin(); if (gate) return gate; return NextResponse.json(dbx.listReviews(false)); }

export async function POST(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const parsed = reviewSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(dbx.createReview({ ...parsed.data, status: "APPROVED" }));
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  dbx.updateReviewStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  dbx.deleteReview(id);
  return NextResponse.json({ ok: true });
}

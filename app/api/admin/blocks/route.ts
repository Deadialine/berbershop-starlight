import { NextRequest, NextResponse } from "next/server";
import { blockSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/admin";
import { dbx } from "@/lib/data";

export async function GET() { const gate = await requireAdmin(); if (gate) return gate; return NextResponse.json(dbx.listBlocks()); }

export async function POST(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const parsed = blockSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(dbx.createBlock(parsed.data));
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const parsed = blockSchema.safeParse(await req.json());
  if (!parsed.success || !parsed.data.id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id, ...rest } = parsed.data;
  return NextResponse.json(dbx.updateBlock(id, rest));
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  dbx.deleteBlock(id);
  return NextResponse.json({ ok: true });
}

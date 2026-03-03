import { NextRequest, NextResponse } from "next/server";
import { adminServiceSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/admin";
import { dbx } from "@/lib/data";

export async function GET() { const gate = await requireAdmin(); if (gate) return gate; return NextResponse.json(dbx.listServices(false)); }

export async function POST(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const parsed = adminServiceSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(dbx.createService(parsed.data));
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const parsed = adminServiceSchema.safeParse(await req.json());
  if (!parsed.success || !parsed.data.id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id, ...data } = parsed.data;
  return NextResponse.json(dbx.updateService(id, data));
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin(); if (gate) return gate;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  dbx.deleteService(id);
  return NextResponse.json({ ok: true });
}

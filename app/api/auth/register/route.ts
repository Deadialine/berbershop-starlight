import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbx } from "@/lib/data";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (dbx.getUserByEmail(email)) return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  const hash = await bcrypt.hash(parsed.data.password, 10);
  const user = dbx.createUser(email, hash);
  return NextResponse.json({ user });
}

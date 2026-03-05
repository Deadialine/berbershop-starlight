import { NextRequest, NextResponse } from "next/server";
import { reviewSchema } from "@/lib/validation";
import { dbx } from "@/lib/data";

export async function GET() {
  return NextResponse.json(dbx.listReviews(true).slice(0, 20));
}

export async function POST(req: NextRequest) {
  const parsed = reviewSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { name, rating, comment, appointmentId } = parsed.data;
  return NextResponse.json({ review: dbx.createReview({ name, rating, comment, appointmentId, status: "PENDING" }) });
}

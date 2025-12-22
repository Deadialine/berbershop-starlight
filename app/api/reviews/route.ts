import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation";

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { name, rating, comment, appointmentId } = parsed.data;
  const review = await prisma.review.create({
    data: {
      name,
      rating,
      comment,
      appointmentId: appointmentId || undefined,
      status: "PENDING",
    },
  });
  return NextResponse.json({ review });
}

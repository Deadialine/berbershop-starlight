import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const appointments = await prisma.appointment.findMany({ include: { service: true }, orderBy: { startAt: "asc" } });
  const header = [
    "id",
    "customerName",
    "customerPhone",
    "customerEmail",
    "service",
    "status",
    "startAt",
    "endAt",
    "note",
    "confirmationCode",
  ];
  const rows = appointments.map((a) => [
    a.id,
    a.customerName,
    a.customerPhone,
    a.customerEmail || "",
    a.service?.name || "",
    a.status,
    a.startAt.toISOString(),
    a.endAt.toISOString(),
    a.note?.replace(/\n/g, " ") || "",
    a.confirmationCode,
  ]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=starlight-appointments.csv`,
    },
  });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { dbx } from "@/lib/data";

export async function GET() {
  const gate = await requireAdmin(); if (gate) return gate;
  const appointments = dbx.listAppointments();
  const header = ["id","customerName","customerEmail","customerPhone","service","startAt","endAt","status","confirmationCode"];
  const lines = appointments.map((a:any)=>[a.id,a.customerName,a.customerEmail||"",a.customerPhone||"",a.service?.name||"",a.startAt,a.endAt,a.status,a.confirmationCode].map((v:string)=>`"${String(v).replaceAll('"','""')}"`).join(","));
  return new NextResponse([header.join(","), ...lines].join("\n"), { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=appointments.csv" } });
}

import { NextResponse } from "next/server";
import { dbx } from "@/lib/data";

export async function GET() {
  return NextResponse.json(dbx.listServices(true));
}

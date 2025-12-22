import { prisma } from "@/lib/prisma";
import { BookForm } from "./BookForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Book</p>
            <h1 className="font-display text-4xl">Reserve your chair</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Back to home</Link>
        </div>
        <Card className="bg-white/5 text-sm text-white/70">
          Starlight respects your time. We enforce a 2-hour lead time, 30-day window, and no double-booking. Payment happens in shop.
        </Card>
        <BookForm services={services} />
      </div>
    </div>
  );
}

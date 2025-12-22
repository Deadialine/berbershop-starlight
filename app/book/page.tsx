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
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Ραντεβού</p>
            <h1 className="font-display text-4xl">Κράτησε την καρέκλα σου</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Αρχική</Link>
        </div>
        <Card className="bg-white/5 text-sm text-white/70">
          Σεβόμαστε τον χρόνο σου: 2 ώρες lead time, παράθυρο 30 ημερών και χωρίς διπλοκρατήσεις. Πληρωμή στο κατάστημα.
        </Card>
        <BookForm services={services} />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "./ReviewForm";
import Link from "next/link";
import { Quote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Κριτικές</p>
            <h1 className="font-display text-4xl">Οι φωνές των πελατών</h1>
            <p className="text-white/70">Γράψε τη δική σου εμπειρία ή διάβασε τι λένε για τον Δημήτρη.</p>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Αρχική</Link>
        </div>
        <Card className="space-y-4">
          <h2 className="font-display text-2xl">Στείλε κριτική</h2>
          <ReviewForm />
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.length === 0 && <p className="text-white/60">Δεν υπάρχουν ακόμα εγκεκριμένες κριτικές.</p>}
          {reviews.map((review) => (
            <Card key={review.id} className="relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-arch-glow opacity-40 blur-2xl" aria-hidden />
              <div className="flex items-center gap-2 text-accent-cyan">
                <Quote className="h-4 w-4" />
                <span className="text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              </div>
              <p className="mt-2 text-white/80">{review.comment}</p>
              <p className="mt-3 text-sm text-white/60">{review.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

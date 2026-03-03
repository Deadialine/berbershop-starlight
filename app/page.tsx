import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, PhoneCall, Clock3, MapPin, Quote } from "lucide-react";

import { dbx } from "@/lib/data";

export default async function HomePage() {
  const services = dbx.listServices(true).slice(0, 6);
  const reviews = dbx.listReviews(true).slice(0, 4);

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-arch-glow opacity-40 blur-3xl" aria-hidden />

      <section className="section-arc relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mx-auto mb-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent-cyan shadow-glow">
          <Sparkles className="h-4 w-4" /> Σύγχρονο barber lounge · Από το 2025
        </div>

        <div className="relative mb-6">
          <div className="absolute -inset-6 rounded-full bg-accent-cyan/15 blur-3xl" aria-hidden />
          <Image
            src="/logo.svg"
            alt="Λογότυπο Starlight Barbershop"
            width={180}
            height={180}
            className="mx-auto drop-shadow-lg"
            priority
          />
        </div>

        <h1 className="font-display text-5xl text-white drop-shadow-lg sm:text-6xl md:text-7xl">
          Starlight Barbershop
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white/80">
          Barber shop του Δημήτρη Λεοντακιανάκη, απόφοιτου κουρεία στην Αθήνα, με κορυφαία κριτικές και τεχνική στα fades και στα γένια.
        </p>

        <p className="text-white/60">Κατάστημα: Σκάλα, Λακωνίας (απέναντι από το Grill Mafia)</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/book">
            <Button className="px-6 py-3 text-base">Κλείσε ραντεβού</Button>
          </Link>
          <Link href="/info">
            <Button variant="secondary" className="px-6 py-3 text-base">
              Δες πληροφορίες
            </Button>
          </Link>
        </div>
      </section>

      <section className="section-arc relative px-6 py-12" id="services">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Υπηρεσίες</p>
              <h2 className="font-display text-4xl text-white">Διάλεξε το στυλ σου</h2>
            </div>
            <Link href="/book">
              <Button variant="secondary">Δες όλα & κλείσε</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.length === 0 && (
              <Card className="p-6">
                <p className="text-white/70">Οι υπηρεσίες θα εμφανιστούν μόλις ρυθμιστεί η βάση δεδομένων.</p>
              </Card>
            )}
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-white">{service.name}</h3>
                  <span className="rounded-full bg-accent-cyan/20 px-3 py-1 text-xs text-accent-cyan">
                    {service.durationMinutes} λεπτά
                  </span>
                </div>
                <p className="text-sm text-white/70">{service.priceText} · Πληρωμή στο κατάστημα</p>
                <p className="text-sm text-white/60">Χωρίς διπλοκρατήσεις, με σεβασμό στον χρόνο σου.</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-arc relative px-6 py-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Κριτικές</p>
              <h2 className="font-display text-4xl text-white">Τι λένε οι πελάτες</h2>
            </div>
            <Link href="/book" className="text-sm text-accent-cyan hover:text-white">
              Κλείσε το δικό σου
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {reviews.length === 0 && <p className="text-white/60">Οι πρώτες κριτικές έρχονται σύντομα.</p>}
            {reviews.map((review) => (
              <Card key={review.id} className="relative overflow-hidden p-6">
                <div className="flex items-center gap-2 text-accent-cyan">
                  <Quote className="h-4 w-4" />
                  <span className="text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="mt-2 text-white/80">{review.comment}</p>
                <p className="mt-3 text-sm text-white/60">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/40 px-6 py-6 text-center text-sm text-white/60">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-white/70">
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent-cyan shadow-glow" />
            Starlight Barbershop · Από το 2025
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <MapPin className="h-4 w-4" /> Σκάλα, Λακωνίας · +30 210 000 1977
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center sm:hidden">
        <Link href="/book" className="w-[90%]">
          <Button className="w-full py-3 text-base">Κλείσε τώρα</Button>
        </Link>
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, PhoneCall, Clock3, MapPin, Quote } from "lucide-react";

export default async function HomePage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    take: 6,
  });

  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

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
          Barber shop του Δημήτρη Λεοντακιανάκη, απόφοιτου κουρεία στην Αθήνα, με
          κορυφαία κριτικές και τεχνική στα fades και στα γένια.
        </p>

        <p className="text-white/60">
          Κατάστημα: Σκάλα, Λακωνίας (απέναντι από το Grill Mafia)
        </p>

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

      <section className="section-arc relative px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl bg-white/5 p-6 shadow-glow ring-1 ring-white/10 md:grid-cols-3">
          {["Διάλεξε υπηρεσία", "Επίλεξε ώρα", "Χαλάρωσε"].map((title, idx) => (
            <Card key={title} className="h-full bg-gradient-to-b from-white/5 to-white/0">
              <div className="mb-2 text-sm text-accent-cyan">Βήμα {idx + 1}</div>
              <h3 className="font-display text-2xl text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/70">
                {idx === 0 &&
                  "Κούρεμα, fade, περιποίηση γενειάδας ή combo με καθαρές τιμές στο χέρι."}
                {idx === 1 &&
                  "Πραγματική διαθεσιμότητα με σεβασμό στον χρόνο σου και χωρίς διπλοκρατήσεις."}
                {idx === 2 &&
                  "Κάθισε στο σμαραγδί δέρμα, κάτω από τα neon εξάγωνα και άσε τον Δημήτρη να σε φροντίσει."}
              </p>
            </Card>
          ))}
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
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-white">{service.name}</h3>
                  <span className="rounded-full bg-accent-cyan/20 px-3 py-1 text-xs text-accent-cyan">
                    {service.durationMinutes} λεπτά
                  </span>
                </div>
                <p className="text-sm text-white/70">
                  {service.priceText} · Πληρωμή στο κατάστημα
                </p>
                <p className="text-sm text-white/60">
                  Χωρίς διπλοκρατήσεις, με σεβασμό στον χρόνο σου.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-arc relative px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 via-white/0 to-accent-cyan/10 p-8 shadow-glow md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Η εμπειρία</p>
            <h2 className="font-display text-4xl text-white">Modern lounge ενέργεια</h2>
            <p className="mt-3 text-white/80">
              Neon εξαγωνικά φώτα, θερμές LED καμπύλες, σμαραγδί δέρμα, ακριβή εργαλεία.
              Ο Δημήτρης έμαθε στην Αθήνα, αλλά δουλεύει με ρυθμό Λακωνίας.
            </p>
            <ul className="mt-4 space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-cyan" />
                Fades, γένια, kids cut με τεχνική ακριβείας.
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-accent-cyan" />
                Χωρίς διπλοκρατήσεις. Lead time και χρόνος χαλαρός για σένα.
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-accent-cyan" />
                Εύκολη διαχείριση ραντεβού με κωδικό ή link.
              </li>
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-charcoal/70 p-6">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-arch-glow opacity-60 blur-3xl" aria-hidden />
            <h3 className="font-display text-3xl text-white">Ιδιοκτήτης: Δημήτρης Λεοντακιανάκης</h3>
            <p className="mt-3 text-white/75">
              Κατάστημα που ιδρύθηκε το 2025. Εκπαίδευση στην Αθήνα, εμπειρία σε premium κουρεία,
              αποδεδειγμένες κριτικές για steady χέρι και καθαρές γραμμές.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/70">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Ωράριο</p>
                <p className="mt-1">Δευ-Σαβ 10:00 – 19:00</p>
                <p className="text-white/50">Κυριακή κλειστά</p>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Επικοινωνία</p>
                <p className="mt-1">+30 210 000 1977</p>
                <p className="text-white/50">hello@starlight.shop</p>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Διεύθυνση</p>
                <p className="mt-1">Σκάλα, Λακωνίας</p>
                <p className="text-white/50">Απέναντι από το Grill Mafia</p>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Πολιτική</p>
                <p className="mt-1">Χωρίς διπλοκρατήσεις, εύκολες ακυρώσεις.</p>
                <p className="text-white/50">Σεβασμός στον χρόνο σου.</p>
              </div>
            </div>
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
            {reviews.length === 0 && (
              <p className="text-white/60">Οι πρώτες κριτικές έρχονται σύντομα.</p>
            )}

            {reviews.map((review) => (
              <Card key={review.id} className="relative overflow-hidden">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-arch-glow opacity-40 blur-2xl" aria-hidden />
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

          <Link href="/reviews" className="text-sm text-accent-cyan hover:text-white">
            Στείλε τη δική σου κριτική
          </Link>
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

import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, PhoneCall, Clock3, MapPin } from "lucide-react";

export default async function HomePage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, take: 4 });
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-arch-glow opacity-40 blur-3xl" aria-hidden />
      <section className="section-arc relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mx-auto mb-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent-cyan shadow-glow">
          <Sparkles className="h-4 w-4" /> Modern Grooming Since 1977
        </div>
        <div className="relative mb-6">
          <div className="absolute -inset-6 rounded-full bg-accent-cyan/15 blur-3xl" aria-hidden />
          <Image src="/logo.svg" alt="Starlight Barbershop logo" width={180} height={180} className="mx-auto drop-shadow-lg" priority />
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white drop-shadow-lg">Starlight Barbershop</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">
          A premium lounge-inspired grooming studio with neon-cyan glow, emerald leather, and master barbers who respect your time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/book"><Button className="text-base px-6 py-3">Book appointment</Button></Link>
          <Link href="/info"><Button variant="secondary" className="text-base px-6 py-3">Explore the experience</Button></Link>
        </div>
      </section>

      <section className="section-arc relative px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl bg-white/5 p-6 shadow-glow ring-1 ring-white/10 md:grid-cols-3">
          {["Pick your service", "Choose time", "Relax"].map((title, idx) => (
            <Card key={title} className="h-full bg-gradient-to-b from-white/5 to-white/0">
              <div className="mb-2 text-sm text-accent-cyan">Step {idx + 1}</div>
              <h3 className="font-display text-2xl text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/70">
                {idx === 0 && "Select a signature cut, fade, beard sculpt, or combo with transparent in-shop pricing."}
                {idx === 1 && "Browse real-time availability built around our lead time and lounge-like pacing."}
                {idx === 2 && "Arrive to emerald seating, neon hex glow, and barbers who keep you crisp."}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-arc relative px-6 py-12" id="services">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Services</p>
              <h2 className="font-display text-4xl text-white">Choose your craft</h2>
            </div>
            <Link href="/book"><Button variant="secondary">See all & book</Button></Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-white">{service.name}</h3>
                  <span className="rounded-full bg-accent-cyan/20 px-3 py-1 text-xs text-accent-cyan">
                    {service.durationMinutes} min
                  </span>
                </div>
                <p className="text-sm text-white/70">{service.priceText} · Pay in shop</p>
                <p className="text-sm text-white/60">Precision timing, no double-booking.</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-arc relative px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 via-white/0 to-accent-cyan/10 p-8 shadow-glow md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">The Experience</p>
            <h2 className="font-display text-4xl text-white">Modern lounge energy</h2>
            <p className="mt-3 text-white/80">
              Neon cyan hex ceiling glow. Warm-white LED arches. Deep emerald seating. Premium tools. A pace that respects your time and your edge.
            </p>
            <ul className="mt-4 space-y-2 text-white/70">
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent-cyan" />Sharp fades, beard artistry, and kid-friendly finesse.</li>
              <li className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-accent-cyan" />No double-booking. Lead time enforced for punctual starts.</li>
              <li className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-accent-cyan" />Text reminders and easy self-cancel links.</li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-charcoal/70 p-6">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-arch-glow opacity-60 blur-3xl" aria-hidden />
            <h3 className="font-display text-3xl text-white">Since 1977</h3>
            <p className="mt-3 text-white/75">
              Family roots and future-ready craft. Starlight Barbershop blends legacy service with a sleek lounge interior for the modern client.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/70">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Hours</p>
                <p className="mt-1">Mon–Sat 10a–7p</p>
                <p className="text-white/50">Sun closed</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Contact</p>
                <p className="mt-1">(555) 000-1977</p>
                <p className="text-white/50">hello@starlight.shop</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Location</p>
                <p className="mt-1">123 Crescent Ave</p>
                <p className="text-white/50">New York, NY</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-accent-cyan">Policy</p>
                <p className="mt-1">No double-booking, easy cancels.</p>
                <p className="text-white/50">Arrive within 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/40 px-6 py-6 text-center text-sm text-white/60">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-white/70">
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent-cyan shadow-glow" />
            Starlight Barbershop · Since 1977
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <MapPin className="h-4 w-4" /> 123 Crescent Ave · (555) 000-1977
          </div>
        </div>
      </footer>
      <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center sm:hidden">
        <Link href="/book" className="w-[90%]">
          <Button className="w-full py-3 text-base">Book now</Button>
        </Link>
      </div>
    </main>
  );
}

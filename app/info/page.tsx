import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock3, MapPin, PhoneCall } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Info</p>
            <h1 className="font-display text-4xl">Starlight details</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Home</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="flex items-center gap-2 text-accent-cyan"><Clock3 className="h-5 w-5" /> Hours</div>
            <p className="mt-2 text-white/70">Mon–Sat: 10:00 – 19:00</p>
            <p className="text-white/60">Sun: Closed</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-accent-cyan"><MapPin className="h-5 w-5" /> Location</div>
            <p className="mt-2 text-white/70">123 Crescent Ave</p>
            <p className="text-white/60">New York, NY</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-accent-cyan"><PhoneCall className="h-5 w-5" /> Contact</div>
            <p className="mt-2 text-white/70">(555) 000-1977</p>
            <p className="text-white/60">hello@starlight.shop</p>
          </Card>
        </div>
        <Card className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl">Services</h3>
            <p className="text-white/70">Fades, tapers, beard sculpt, hot towel shave, kids cut, premium wash & style. Prices displayed as pay-in-shop.</p>
            <Button asChild className="mt-4"><Link href="/book">Book now</Link></Button>
          </div>
          <div>
            <h3 className="font-display text-2xl">Cancellation</h3>
            <p className="text-white/70">Use your confirmation code or link to cancel anytime. Please cancel at least 3 hours before your slot so we can open it to others.</p>
            <p className="mt-2 text-white/60">No double-booking. Lead time of 2 hours and 30-day booking window enforced.</p>
          </div>
        </Card>
        <Card className="grid gap-6 md:grid-cols-3">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-gradient-to-br from-white/5 via-white/10 to-accent-cyan/10" aria-label={`Gallery placeholder ${i}`} />
          ))}
        </Card>
      </div>
    </div>
  );
}

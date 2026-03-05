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
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Πληροφορίες</p>
            <h1 className="font-display text-4xl">Λεπτομέρειες Starlight</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Αρχική</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="flex items-center gap-2 text-accent-cyan"><Clock3 className="h-5 w-5" /> Ωράριο</div>
            <p className="mt-2 text-white/70">Δευ–Σαβ: 10:00 – 19:00</p>
            <p className="text-white/60">Κυριακή: Κλειστά</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-accent-cyan"><MapPin className="h-5 w-5" /> Διεύθυνση</div>
            <p className="mt-2 text-white/70">Σκάλα, Λακωνίας</p>
            <p className="text-white/60">Απέναντι από το Grill Mafia</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-accent-cyan"><PhoneCall className="h-5 w-5" /> Επικοινωνία</div>
            <p className="mt-2 text-white/70">+30 210 000 1977</p>
            <p className="text-white/60">hello@starlight.shop</p>
          </Card>
        </div>
        <Card className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl">Υπηρεσίες</h3>
            <p className="text-white/70">Κούρεμα €10, Fade €12, Γένια €5, Fade + Γένια €17, παιδικά κουρέματα, λούσιμο & styling. Πληρωμή στο κατάστημα.</p>
            <Link href="/book" className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent-cyan to-accent-emerald px-4 py-2 text-sm font-semibold text-charcoal shadow-glow hover:brightness-110">Κλείσε ραντεβού</Link>
          </div>
          <div>
            <h3 className="font-display text-2xl">Ακύρωση</h3>
            <p className="text-white/70">Με κωδικό επιβεβαίωσης ή direct link ακυρώνεις όποτε χρειάζεται. Ιδανικά 3 ώρες πριν.</p>
            <p className="mt-2 text-white/60">Χωρίς διπλοκρατήσεις, lead time 2 ώρες, παράθυρο 30 ημερών.</p>
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-2xl">Δημήτρης Λεοντακιανάκης</h3>
          <p className="text-white/70">Ιδιοκτήτης & κουρέας. Σπουδές κουρέματος στην Αθήνα, εμπειρία σε premium lounge barbershops και εξαιρετικές κριτικές για fades και γενειάδες.</p>
          <p className="mt-2 text-white/60">Εδραιωμένο το 2025 στη Σκάλα Λακωνίας.</p>
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

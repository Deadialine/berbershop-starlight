import { Card } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { dbx } from "@/lib/data";

export default async function AdminHome() {
  const all = dbx.listAppointments();
  const now = new Date();
  const upcoming = all.filter((a:any) => a.status !== "CANCELLED" && new Date(a.startAt) >= now).slice(0, 5);
  const servicesCount = dbx.listServices(true).length;
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);
  const bookedToday = all.filter((a:any)=>a.status !== "CANCELLED" && new Date(a.startAt) >= start && new Date(a.startAt) < end).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-white/60">Ενεργές υπηρεσίες</p><p className="font-display text-4xl">{servicesCount}</p></Card>
        <Card><p className="text-sm text-white/60">Σήμερα</p><p className="font-display text-4xl">{bookedToday}</p></Card>
        <Card><p className="text-sm text-white/60">Επόμενα ραντεβού</p><p className="font-display text-4xl">{upcoming.length}</p></Card>
      </div>
      <Card className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="font-display text-2xl">Επερχόμενα</h2><Link href="/admin/appointments" className="text-sm text-accent-cyan">Διαχείριση</Link></div>
        {upcoming.length === 0 && <p className="text-white/60">Δεν υπάρχουν προσεχή ραντεβού.</p>}
        <div className="space-y-2">{upcoming.map((a:any)=><div key={a.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80"><div><div className="font-medium">{a.customerName}</div><div className="text-white/60">{a.service?.name}</div></div><div className="text-right text-white/70">{format(new Date(a.startAt), "EEE, MMM d @ p")}</div></div>)}</div>
      </Card>
    </div>
  );
}

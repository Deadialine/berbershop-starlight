import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminHome() {
  const upcoming = await prisma.appointment.findMany({
    where: { status: { not: "CANCELLED" }, startAt: { gte: new Date() } },
    include: { service: true },
    orderBy: { startAt: "asc" },
    take: 5,
  });
  const servicesCount = await prisma.service.count();
  const bookedToday = await prisma.appointment.count({
    where: {
      startAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      status: { not: "CANCELLED" },
    },
  });
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-white/60">Ενεργές υπηρεσίες</p>
          <p className="font-display text-4xl">{servicesCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-white/60">Σήμερα</p>
          <p className="font-display text-4xl">{bookedToday}</p>
        </Card>
        <Card>
          <p className="text-sm text-white/60">Επόμενα ραντεβού</p>
          <p className="font-display text-4xl">{upcoming.length}</p>
        </Card>
      </div>
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Επερχόμενα</h2>
          <Link href="/admin/appointments" className="text-sm text-accent-cyan">Διαχείριση</Link>
        </div>
        {upcoming.length === 0 && <p className="text-white/60">Δεν υπάρχουν προσεχή ραντεβού.</p>}
        <div className="space-y-2">
          {upcoming.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80">
              <div>
                <div className="font-medium">{a.customerName}</div>
                <div className="text-white/60">{a.service?.name}</div>
              </div>
              <div className="text-right text-white/70">{format(a.startAt, "EEE, MMM d @ p")}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

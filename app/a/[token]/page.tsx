import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { TokenManager } from "./TokenManager";
import Link from "next/link";
import { dbx } from "@/lib/data";

interface Props { params: { token: string } }

export default async function AppointmentByToken({ params }: Props) {
  const appointment = dbx.getAppointmentByToken(params.token);
  if (!appointment) return notFound();
  const statusLabel: Record<string, string> = { BOOKED: "Κλεισμένο", COMPLETED: "Ολοκληρωμένο", NOSHOW: "No-show", CANCELLED: "Ακυρωμένο" };
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Σύνδεσμος διαχείρισης</p><h1 className="font-display text-4xl">Το ραντεβού σου</h1></div><Link href="/" className="text-sm text-white/60 hover:text-white">Αρχική</Link></div>
        <Card className="space-y-2">
          <h3 className="font-display text-2xl">{appointment.service?.name}</h3>
          <p className="text-white/70">{format(new Date(appointment.startAt), "EEEE, MMM d @ p")}</p>
          <p className="text-white/60">Κωδικός: {appointment.confirmationCode}</p>
          <p className="text-white/60">Κατάσταση: {statusLabel[appointment.status] || appointment.status}</p>
          <TokenManager
            id={appointment.id}
            token={appointment.cancelToken}
            serviceId={appointment.serviceId}
            initialStatus={appointment.status}
          />
        </Card>
      </div>
    </div>
  );
}

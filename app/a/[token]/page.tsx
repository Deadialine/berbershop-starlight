import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { TokenManager } from "./TokenManager";
import Link from "next/link";

interface Props { params: { token: string } }

export default async function AppointmentByToken({ params }: Props) {
  const appointment = await prisma.appointment.findUnique({
    where: { cancelToken: params.token },
    include: { service: true },
  });
  if (!appointment) return notFound();
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Manage link</p>
            <h1 className="font-display text-4xl">Your appointment</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Home</Link>
        </div>
        <Card className="space-y-2">
          <h3 className="font-display text-2xl">{appointment.service?.name}</h3>
          <p className="text-white/70">{format(appointment.startAt, "EEEE, MMM d @ p")}</p>
          <p className="text-white/60">Code: {appointment.confirmationCode}</p>
          <p className="text-white/60">Status: {appointment.status}</p>
          <TokenManager id={appointment.id} token={appointment.cancelToken} initialStatus={appointment.status} />
        </Card>
      </div>
    </div>
  );
}

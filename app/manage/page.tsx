import { ManageForm } from "./ManageForm";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbx } from "@/lib/data";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

export default async function ManagePage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const appts = userRole === "guest" ? dbx.listUserAppointments((session?.user as any).id) : [];

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Διαχείριση</p>
            <h1 className="font-display text-4xl">Εύρεση ή ακύρωση</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Αρχική</Link>
        </div>

        {userRole === "guest" ? (
          <Card className="space-y-3">
            <h2 className="font-display text-2xl">My appointments</h2>
            {appts.length === 0 && <p className="text-white/70">No appointments yet.</p>}
            {appts.map((a:any) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                <div>
                  <div>{a.service?.name}</div>
                  <div className="text-sm text-white/70">{format(new Date(a.startAt), "EEE, MMM d @ p")}</div>
                </div>
                <a className="text-accent-cyan" href={`/a/${a.cancelToken}`}>Manage</a>
              </div>
            ))}
          </Card>
        ) : (
          <>
            <p className="text-white/70">Πληκτρολόγησε τον κωδικό επιβεβαίωσης για να δεις ή να ακυρώσεις το ραντεβού. Μπορείς επίσης να χρησιμοποιήσεις το direct link.</p>
            <ManageForm />
          </>
        )}
      </div>
    </div>
  );
}

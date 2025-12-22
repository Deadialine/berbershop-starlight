import { AppointmentTable } from "./AppointmentTable";

export default async function AdminAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Ραντεβού</p>
        <h1 className="font-display text-4xl">Πρόγραμμα & κατάσταση</h1>
      </div>
      <AppointmentTable />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { clsx } from "clsx";

const statusColors: Record<string, string> = {
  BOOKED: "text-accent-cyan",
  COMPLETED: "text-green-300",
  NOSHOW: "text-yellow-300",
  CANCELLED: "text-red-300",
};

type Appointment = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  note?: string | null;
  startAt: string;
  endAt: string;
  status: string;
  serviceId: string;
  service?: { name: string };
  confirmationCode: string;
  cancelToken: string;
};

export function AppointmentTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/appointments");
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    const appointment = appointments.find((a) => a.id === id);
    if (!appointment) return;
    const payload = { ...appointment, status };
    await fetch("/api/admin/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const filtered = appointments.filter((a) =>
    filter ? a.status === filter || a.customerName.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="BOOKED">Booked</option>
          <option value="COMPLETED">Completed</option>
          <option value="NOSHOW">No-show</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
        <Button onClick={load} loading={loading}>Refresh</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Start</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{a.customerName}</div>
                  <div className="text-xs text-white/60">{a.customerPhone}</div>
                  {a.customerEmail && <div className="text-xs text-white/60">{a.customerEmail}</div>}
                </td>
                <td className="px-4 py-3 text-white/70">{a.service?.name}</td>
                <td className="px-4 py-3 text-white/70">{format(parseISO(a.startAt), "EEE, MMM d @ p")}</td>
                <td className="px-4 py-3">
                  <span className={clsx("font-semibold", statusColors[a.status] || "text-white")}>{a.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} aria-label="Status">
                      <option value="BOOKED">Booked</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="NOSHOW">No-show</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Select>
                    <Button asChild variant="secondary">
                      <a href={`/a/${a.cancelToken}`} target="_blank" rel="noreferrer">Link</a>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/50">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

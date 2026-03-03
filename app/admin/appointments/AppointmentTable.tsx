"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { clsx } from "clsx";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
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
  service?: { name: string } | null;
  confirmationCode: string;
  cancelToken: string;
};

const statusColors: Record<string, string> = {
  BOOKED: "text-accent-cyan",
  COMPLETED: "text-green-300",
  NOSHOW: "text-yellow-300",
  CANCELLED: "text-red-300",
};

const statuses = ["BOOKED", "COMPLETED", "NOSHOW", "CANCELLED"];

function isoToInputValue(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function AppointmentTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [draft, setDraft] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceId: "",
    startAt: "",
    status: "BOOKED",
    note: "",
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (serviceId) params.set("serviceId", serviceId);
    if (from) params.set("from", new Date(from).toISOString());
    if (to) params.set("to", new Date(to).toISOString());
    return params.toString();
  }, [q, status, serviceId, from, to]);

  async function load() {
    setLoading(true);
    const [appointmentsRes, servicesRes] = await Promise.all([
      fetch(`/api/admin/appointments${query ? `?${query}` : ""}`),
      fetch("/api/admin/services"),
    ]);
    const [appointmentsJson, servicesJson] = await Promise.all([appointmentsRes.json(), servicesRes.json()]);
    setAppointments(appointmentsJson);
    setServices(servicesJson);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function updateAppointment(appt: Appointment, updates: Partial<Appointment>) {
    const payload = { ...appt, ...updates };
    const res = await fetch("/api/admin/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to update appointment");
      return;
    }
    await load();
  }

  async function createAppointment() {
    const selected = services.find((s) => s.id === draft.serviceId);
    if (!selected) return;
    const start = new Date(draft.startAt);
    const end = new Date(start.getTime() + selected.durationMinutes * 60_000);

    const res = await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: draft.customerName,
        customerPhone: draft.customerPhone,
        customerEmail: draft.customerEmail,
        note: draft.note,
        serviceId: draft.serviceId,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        status: draft.status,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to create appointment");
      return;
    }

    setDraft({ customerName: "", customerPhone: "", customerEmail: "", serviceId: "", startAt: "", status: "BOOKED", note: "" });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-5">
        <Input placeholder="Search name/phone/email" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
        <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 text-lg text-white">Create appointment</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Customer name" value={draft.customerName} onChange={(e) => setDraft((v) => ({ ...v, customerName: e.target.value }))} />
          <Input placeholder="Phone" value={draft.customerPhone} onChange={(e) => setDraft((v) => ({ ...v, customerPhone: e.target.value }))} />
          <Input placeholder="Email" value={draft.customerEmail} onChange={(e) => setDraft((v) => ({ ...v, customerEmail: e.target.value }))} />
          <Select value={draft.serviceId} onChange={(e) => setDraft((v) => ({ ...v, serviceId: e.target.value }))}>
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <Input type="datetime-local" value={draft.startAt} onChange={(e) => setDraft((v) => ({ ...v, startAt: e.target.value }))} />
          <Select value={draft.status} onChange={(e) => setDraft((v) => ({ ...v, status: e.target.value }))}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Input placeholder="Note" value={draft.note} onChange={(e) => setDraft((v) => ({ ...v, note: e.target.value }))} />
          <Button onClick={createAppointment} disabled={!draft.customerName || !draft.customerPhone || !draft.serviceId || !draft.startAt}>Create</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
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
                  <div className="flex flex-wrap gap-2">
                    <Input
                      type="datetime-local"
                      defaultValue={isoToInputValue(a.startAt)}
                      onBlur={(e) => {
                        const start = new Date(e.target.value);
                        const service = services.find((s) => s.id === a.serviceId);
                        if (!service) return;
                        const end = new Date(start.getTime() + service.durationMinutes * 60_000);
                        updateAppointment(a, { startAt: start.toISOString(), endAt: end.toISOString() });
                      }}
                    />
                    <Select value={a.status} onChange={(e) => updateAppointment(a, { status: e.target.value })}>
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                    <a href={`/a/${a.cancelToken}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15">Link</a>
                  </div>
                </td>
              </tr>
            ))}
            {!appointments.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/50">
                  {loading ? "Loading..." : "Δεν βρέθηκαν ραντεβού."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

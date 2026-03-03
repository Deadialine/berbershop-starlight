"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";

type Slot = { start: string; end: string };

export function TokenManager({
  id,
  token,
  serviceId,
  initialStatus,
}: {
  id: string;
  token: string;
  serviceId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotStart, setSlotStart] = useState("");
  const [message, setMessage] = useState("");
  const isCancelled = status === "CANCELLED";

  async function loadSlots(selectedDate: string) {
    setDate(selectedDate);
    setMessage("");
    if (!selectedDate) return;
    const res = await fetch(`/api/availability?serviceId=${serviceId}&date=${selectedDate}`);
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Could not load availability");
      return;
    }
    setSlots(data);
  }

  async function cancel() {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to cancel");
      setStatus(data.appointment.status);
      setMessage("Appointment cancelled.");
    } catch (err: any) {
      setMessage(err.message || "Unable to cancel");
    } finally {
      setLoading(false);
    }
  }

  async function reschedule() {
    if (!slotStart) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, slotStart }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to reschedule");
      setStatus(data.appointment.status);
      setMessage(`Rescheduled to ${format(parseISO(data.appointment.startAt), "EEE, MMM d @ p")}`);
      setSlotStart("");
    } catch (err: any) {
      setMessage(err.message || "Unable to reschedule");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button variant="secondary" disabled>
          Κατάσταση: {status}
        </Button>
        {!isCancelled && (
          <Button variant="ghost" onClick={cancel} loading={loading}>
            Ακύρωση
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-white/70">Αλλαγή ημερομηνίας/ώρας</p>
        <Input type="date" value={date} onChange={(e) => loadSlots(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <Button
              key={slot.start}
              variant={slotStart === slot.start ? "secondary" : "ghost"}
              onClick={() => setSlotStart(slot.start)}
            >
              {format(parseISO(slot.start), "EEE p")}
            </Button>
          ))}
        </div>
        <Button onClick={reschedule} disabled={!slotStart || loading} loading={loading}>
          Επαναπρογραμματισμός
        </Button>
      </div>

      {message && <p className="text-sm text-white/70">{message}</p>}
    </div>
  );
}

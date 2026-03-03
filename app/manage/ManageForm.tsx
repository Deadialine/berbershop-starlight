"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

export function ManageForm() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function lookup() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/appointments/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, phone: phone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Δεν βρέθηκε ραντεβού");
      setAppointment(data.appointment);
    } catch (err: any) {
      setMessage(err.message || "Κάτι πήγε στραβά");
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  }

  async function cancel(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Δεν ολοκληρώθηκε η ακύρωση");
      setAppointment(data.appointment);
      setMessage("Ακυρώθηκε. Μπορείς να κλείσεις ξανά όποτε θες.");
    } catch (err: any) {
      setMessage(err.message || "Κάτι πήγε στραβά");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Κωδικός επιβεβαίωσης" aria-label="Κωδικός" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Τηλέφωνο (προαιρετικό)" aria-label="Τηλέφωνο" />
        </div>
        <Button onClick={lookup} loading={loading} disabled={!code}>
          Εύρεση ραντεβού
        </Button>
        {message && <p className="text-sm text-white/70">{message}</p>}
      </Card>
      {appointment && (
        <Card className="space-y-2">
          <h3 className="font-display text-2xl">Ραντεβού</h3>
          <p className="text-white/70">{appointment.service?.name}</p>
          <p className="text-white/70">{format(parseISO(appointment.startAt), "EEE, MMM d @ p")}</p>
          <p className="text-white/50">Κωδικός: {appointment.confirmationCode}</p>
          <p className="text-white/50">Σύνδεσμος διαχείρισης: /a/{appointment.cancelToken}</p>
          <div className="flex gap-3">
            <a href={`/a/${appointment.cancelToken}`} className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15">Άνοιγμα συνδέσμου</a>
            {appointment.status !== "CANCELLED" && (
              <Button variant="ghost" onClick={() => cancel(appointment.id)} loading={loading}>
                Ακύρωση
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

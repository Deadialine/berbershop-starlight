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
      if (!res.ok) throw new Error(data.error || "Not found");
      setAppointment(data.appointment);
    } catch (err: any) {
      setMessage(err.message);
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
      if (!res.ok) throw new Error(data.error || "Unable to cancel");
      setAppointment(data.appointment);
      setMessage("Cancelled. You can rebook anytime.");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Confirmation code" aria-label="Confirmation code" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" aria-label="Phone" />
        </div>
        <Button onClick={lookup} loading={loading} disabled={!code}>
          Look up appointment
        </Button>
        {message && <p className="text-sm text-white/70">{message}</p>}
      </Card>
      {appointment && (
        <Card className="space-y-2">
          <h3 className="font-display text-2xl">Appointment</h3>
          <p className="text-white/70">{appointment.service?.name}</p>
          <p className="text-white/70">{format(parseISO(appointment.startAt), "EEE, MMM d @ p")}</p>
          <p className="text-white/50">Code: {appointment.confirmationCode}</p>
          <p className="text-white/50">Manage link: /a/{appointment.cancelToken}</p>
          <div className="flex gap-3">
            <Button variant="secondary" asChild>
              <a href={`/a/${appointment.cancelToken}`}>Open manage link</a>
            </Button>
            {appointment.status !== "CANCELLED" && (
              <Button variant="ghost" onClick={() => cancel(appointment.id)} loading={loading}>
                Cancel appointment
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

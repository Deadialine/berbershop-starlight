"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TokenManager({ id, token, initialStatus }: { id: string; token: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const isCancelled = status === "CANCELLED";

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3">
      <Button variant="secondary" disabled>
        Status: {status}
      </Button>
      {!isCancelled && (
        <Button variant="ghost" onClick={cancel} loading={loading}>
          Cancel appointment
        </Button>
      )}
    </div>
  );
}

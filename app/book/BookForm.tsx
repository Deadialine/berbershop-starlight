"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { BOOKING_WINDOW_DAYS } from "@/lib/config";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clsx } from "clsx";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceText: string;
};

type Appointment = {
  id: string;
  confirmationCode: string;
  cancelToken: string;
  startAt: string;
  endAt: string;
  service: Service;
  customerName: string;
  customerPhone: string;
};

type Slot = { start: string; end: string };

export function BookForm({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotStart, setSlotStart] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const router = useRouter();

  const minDate = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const maxDate = useMemo(
    () => format(new Date(Date.now() + BOOKING_WINDOW_DAYS * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    []
  );

  useEffect(() => {
    async function loadSlots() {
      if (!serviceId || !date) return;
      setLoadingSlots(true);
      setError("");
      try {
        const res = await fetch(`/api/availability?serviceId=${serviceId}&date=${date}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load availability");
        setSlots(data);
        setSlotStart("");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [serviceId, date]);

  async function submit(formData: FormData) {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        serviceId,
        slotStart,
        customerName: formData.get("name") as string,
        customerPhone: formData.get("phone") as string,
        customerEmail: (formData.get("email") as string) || undefined,
        note: (formData.get("note") as string) || undefined,
      };
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.["formErrors"] || data.error?.message || "Unable to book");
      setAppointment(data.appointment);
      toast.success("Appointment booked. Confirmation ready.");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!services.length) return <p className="text-white/70">No services are active right now.</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <form
          action={async (formData) => {
            await submit(formData);
          }}
          className="space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-white/70">Service</span>
              <Select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} • {service.durationMinutes} min • {service.priceText}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2">
              <span className="text-sm text-white/70">Date</span>
              <Input type="date" min={minDate} max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Select a time</span>
              {loadingSlots && <span className="text-xs text-accent-cyan">Loading slots…</span>}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {slots.map((slot) => {
                const label = format(parseISO(slot.start), "EEE p");
                const selected = slotStart === slot.start;
                return (
                  <button
                    type="button"
                    key={slot.start}
                    onClick={() => setSlotStart(slot.start)}
                    className={clsx(
                      "rounded-xl border px-3 py-2 text-sm transition",
                      selected
                        ? "border-accent-cyan bg-accent-cyan/20 text-white shadow-glow"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-accent-cyan/60"
                    )}
                    aria-pressed={selected}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {!loadingSlots && date && !slots.length && (
              <p className="mt-3 text-sm text-white/60">No slots available for this day. Try another.</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-white/70">Name</span>
              <Input name="name" placeholder="Your name" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-white/70">Phone</span>
              <Input name="phone" type="tel" inputMode="tel" placeholder="(555)" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-white/70">Email (optional)</span>
              <Input name="email" type="email" placeholder="you@email.com" />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-white/70">Note (optional)</span>
              <Textarea name="note" rows={2} placeholder="Tell your barber anything helpful." />
            </label>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-white/60">Lead time enforced. You&apos;ll get a confirmation code to manage your visit.</div>
            <Button type="submit" loading={submitting} disabled={!slotStart}>
              Book appointment
            </Button>
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-display text-2xl">Your confirmation</h3>
        {appointment ? (
          <div className="space-y-3 text-sm text-white/80">
            <p>Saved for {format(parseISO(appointment.startAt), "EEEE, MMM d @ p")}.</p>
            <p>
              Code: <span className="font-semibold text-accent-cyan">{appointment.confirmationCode}</span>
            </p>
            <p>
              Manage link: <span className="text-accent-cyan">/a/{appointment.cancelToken}</span>
            </p>
            <p>Bring payment for in-shop checkout.</p>
            <Button asChild variant="secondary">
              <a href={`/a/${appointment.cancelToken}`}>Open manage page</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-white/70">
            <p>Select a slot to preview your confirmation details.</p>
            <p>Need to cancel? Use your code or direct link.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

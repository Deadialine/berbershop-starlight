"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  priceText: string;
  isActive: boolean;
}

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ name: "", durationMinutes: 30, priceText: "$", isActive: true });

  async function load() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", durationMinutes: 30, priceText: "$", isActive: true });
    load();
  }

  async function toggle(service: Service) {
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...service, isActive: !service.isActive }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="space-y-3">
        <h3 className="font-display text-2xl">Νέα υπηρεσία</h3>
        <Input placeholder="Όνομα" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input
          placeholder="Διάρκεια (λεπτά)"
          type="number"
          value={form.durationMinutes}
          onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
        />
        <Input placeholder="Τιμή (κείμενο)" value={form.priceText} onChange={(e) => setForm({ ...form, priceText: e.target.value })} />
        <div className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-white/20 bg-white/5"
          />
          Ενεργή
        </div>
        <Button onClick={save} disabled={!form.name}>Αποθήκευση</Button>
      </Card>
      <Card className="lg:col-span-2 space-y-3">
        <h3 className="font-display text-2xl">Τρέχουσες υπηρεσίες</h3>
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
              <div>
                <div className="font-medium text-white">{s.name}</div>
                <div className="text-white/60">{s.durationMinutes} min • {s.priceText}</div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={s.isActive ? "1" : "0"} onChange={() => toggle(s)}>
                  <option value="1">Ενεργή</option>
                  <option value="0">Κρυφή</option>
                </Select>
                <Button variant="ghost" onClick={() => remove(s.id)}>Διαγραφή</Button>
              </div>
            </div>
          ))}
          {!services.length && <p className="text-white/60">Καμία υπηρεσία.</p>}
        </div>
      </Card>
    </div>
  );
}

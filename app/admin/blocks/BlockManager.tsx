"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface Block {
  id: string;
  startAt: string;
  endAt: string;
  reason?: string | null;
}

export function BlockManager() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [reason, setReason] = useState("");

  async function load() {
    const res = await fetch("/api/admin/blocks");
    const data = await res.json();
    setBlocks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    await fetch("/api/admin/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startAt, endAt, reason }),
    });
    setStartAt("");
    setEndAt("");
    setReason("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/blocks?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="space-y-3">
        <h3 className="font-display text-2xl">Κλείσιμο χρόνου</h3>
        <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        <Input placeholder="Λόγος (προαιρετικό)" value={reason} onChange={(e) => setReason(e.target.value)} />
        <Button onClick={save} disabled={!startAt || !endAt}>Αποθήκευση</Button>
      </Card>
      <Card className="lg:col-span-2 space-y-3">
        <h3 className="font-display text-2xl">Επερχόμενα κλεισίματα</h3>
        <div className="space-y-2">
          {blocks.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
              <div>
                <div className="font-medium text-white">{b.reason || "Blocked"}</div>
                <div className="text-white/60">{format(parseISO(b.startAt), "MMM d @ p")} - {format(parseISO(b.endAt), "p")}</div>
              </div>
              <Button variant="ghost" onClick={() => remove(b.id)}>Αφαίρεση</Button>
            </div>
          ))}
          {!blocks.length && <p className="text-white/60">Καμία κλειστή ώρα.</p>}
        </div>
      </Card>
    </div>
  );
}

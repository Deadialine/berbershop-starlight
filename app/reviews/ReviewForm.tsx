"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating: Number(rating), comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors || "Δεν στάλθηκε η κριτική");
      setSubmitted(true);
      toast.success("Ευχαριστούμε! Θα εμφανιστεί μόλις εγκριθεί.");
    } catch (err: any) {
      toast.error(err.message || "Κάτι πήγε στραβά");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Όνομα" value={name} onChange={(e) => setName(e.target.value)} required />
        <Select value={rating} onChange={(e) => setRating(e.target.value)} aria-label="Βαθμολογία">
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </Select>
      </div>
      <Textarea placeholder="Σχόλιο" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required />
      <Button type="submit" loading={loading} disabled={submitted}>
        Στείλε κριτική
      </Button>
      {submitted && <p className="text-sm text-white/60">Η κριτική θα εμφανιστεί μόλις εγκριθεί.</p>}
    </form>
  );
}

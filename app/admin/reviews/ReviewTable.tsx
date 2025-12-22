"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  PENDING: "Σε αναμονή",
  APPROVED: "Εγκεκριμένη",
};

export function ReviewTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  async function remove(id: string) {
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button onClick={load} loading={loading}>Ανανέωση</Button>
      </div>
      <div className="grid gap-3">
        {reviews.map((review) => (
          <Card key={review.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-white font-medium">{review.name}</div>
              <div className="text-sm text-accent-cyan">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
            </div>
            <p className="text-white/70">{review.comment}</p>
            <div className="flex items-center gap-2 text-sm">
              <Select value={review.status} onChange={(e) => updateStatus(review.id, e.target.value)}>
                <option value="PENDING">Σε αναμονή</option>
                <option value="APPROVED">Εγκεκριμένη</option>
              </Select>
              <Button variant="ghost" onClick={() => remove(review.id)}>Διαγραφή</Button>
            </div>
            <p className="text-xs text-white/50">{statusLabels[review.status] || review.status}</p>
          </Card>
        ))}
        {!reviews.length && <p className="text-white/60">Καμία κριτική ακόμα.</p>}
      </div>
    </div>
  );
}

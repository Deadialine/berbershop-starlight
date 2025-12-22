import { ReviewTable } from "./ReviewTable";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Κριτικές</p>
        <h1 className="font-display text-4xl">Έγκριση & διαχείριση</h1>
      </div>
      <ReviewTable />
    </div>
  );
}

import { Card } from "@/components/ui/card";

export default function AdminExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Εξαγωγή</p>
        <h1 className="font-display text-4xl">CSV ραντεβού</h1>
      </div>
      <Card className="space-y-3">
        <p className="text-white/70">Κατέβασε CSV με όλα τα ραντεβού (κατάσταση, στοιχεία, κωδικοί).</p>
        <a
          href="/api/admin/export"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent-cyan to-accent-emerald px-4 py-2 text-sm font-semibold text-charcoal shadow-glow hover:brightness-110"
        >
          Export CSV
        </a>
      </Card>
    </div>
  );
}

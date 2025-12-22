import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Export</p>
        <h1 className="font-display text-4xl">Data export</h1>
      </div>
      <Card className="space-y-3">
        <p className="text-white/70">Download a CSV of all appointments including status, contact info, and codes.</p>
        <Button asChild>
          <a href="/api/admin/export">Export CSV</a>
        </Button>
      </Card>
    </div>
  );
}

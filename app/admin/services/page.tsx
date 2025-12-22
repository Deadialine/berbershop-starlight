import { ServiceManager } from "./ServiceManager";

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Υπηρεσίες</p>
        <h1 className="font-display text-4xl">Διαχείριση υπηρεσιών</h1>
      </div>
      <ServiceManager />
    </div>
  );
}

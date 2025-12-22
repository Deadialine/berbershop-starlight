import { BlockManager } from "./BlockManager";

export default function AdminBlocksPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Κλειστές ώρες</p>
        <h1 className="font-display text-4xl">Διακοπές προγράμματος</h1>
      </div>
      <BlockManager />
    </div>
  );
}

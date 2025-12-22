import { BlockManager } from "./BlockManager";

export default function AdminBlocksPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Blocks</p>
        <h1 className="font-display text-4xl">Schedule holds</h1>
      </div>
      <BlockManager />
    </div>
  );
}

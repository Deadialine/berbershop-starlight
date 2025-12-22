import { ManageForm } from "./ManageForm";
import Link from "next/link";

export default function ManagePage() {
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Manage</p>
            <h1 className="font-display text-4xl">Find or cancel</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Home</Link>
        </div>
        <p className="text-white/70">Enter your confirmation code to view or cancel your appointment. You can also use the direct link we generated at booking.</p>
        <ManageForm />
      </div>
    </div>
  );
}

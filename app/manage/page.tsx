import { ManageForm } from "./ManageForm";
import Link from "next/link";

export default function ManagePage() {
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Διαχείριση</p>
            <h1 className="font-display text-4xl">Εύρεση ή ακύρωση</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Αρχική</Link>
        </div>
        <p className="text-white/70">Πληκτρολόγησε τον κωδικό επιβεβαίωσης για να δεις ή να ακυρώσεις το ραντεβού. Μπορείς επίσης να χρησιμοποιήσεις το direct link.</p>
        <ManageForm />
      </div>
    </div>
  );
}

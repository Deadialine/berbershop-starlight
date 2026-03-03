import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return (
      <div className="min-h-screen bg-charcoal text-center text-white">
        <div className="pt-24 text-white/70">Redirecting...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent-cyan">Starlight Admin</p>
          <p className="font-display text-2xl">Πίνακας ελέγχου</p>
        </div>
        <nav className="flex gap-3 text-sm text-white/70">
          <Link href="/admin" className="hover:text-white">Σύνοψη</Link>
          <Link href="/admin/appointments" className="hover:text-white">Ραντεβού</Link>
          <Link href="/admin/services" className="hover:text-white">Υπηρεσίες</Link>
          <Link href="/admin/blocks" className="hover:text-white">Κλειστές Ώρες</Link>
          <Link href="/admin/reviews" className="hover:text-white">Κριτικές</Link>
          <Link href="/admin/export" className="hover:text-white">Εξαγωγή</Link>
        </nav>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}

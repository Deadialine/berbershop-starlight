import { BookForm } from "./BookForm";
import Link from "next/link";
import { dbx } from "@/lib/data";

export default async function BookPage() {
  const services = dbx.listServices(true);
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Online Booking</p>
            <h1 className="font-display text-4xl">Κλείσε το ραντεβού σου</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white">Αρχική</Link>
        </div>
        <BookForm services={services} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starlight Barbershop | Κουρεία Δημήτρης Λεοντακιανάκης",
  description: "Κλείσε ραντεβού σε σύγχρονο barber lounge στη Σκάλα Λακωνίας, με neon αισθητική και εμπειρία στα fades.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-charcoal text-white">
        <div className="background-hex min-h-screen">
          {children}
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });

export const metadata: Metadata = {
  title: "Starlight Barbershop | Κουρεία Δημήτρης Λεοντακιανάκης",
  description: "Κλείσε ραντεβού σε σύγχρονο barber lounge στη Σκάλα Λακωνίας, με neon αισθητική και εμπειρία στα fades.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="bg-charcoal text-white min-h-screen">
        <div className="background-hex min-h-screen">
          {children}
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}

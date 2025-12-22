import { LoginForm } from "./LoginForm";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6 py-12">
      <div className="space-y-4 text-center">
        <div className="text-sm uppercase tracking-[0.3em] text-accent-cyan">Starlight Admin</div>
        <LoginForm />
        <Link href="/" className="block text-sm text-white/60 hover:text-white">Επιστροφή</Link>
      </div>
    </div>
  );
}

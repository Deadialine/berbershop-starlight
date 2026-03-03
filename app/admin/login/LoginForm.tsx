"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    if (res?.error) {
      setError("Λάθος στοιχεία");
    } else if (res?.ok) {
      window.location.href = callbackUrl;
    }
    setLoading(false);
  }

  return (
    <Card className="max-w-md space-y-4">
      <h1 className="font-display text-3xl">Είσοδος διαχειριστή</h1>
      <p className="text-sm text-white/60">Demo credentials: admin / admin</p>
      <form onSubmit={submit} className="space-y-3">
        <Input type="text" placeholder="Username or email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        <Input type="password" placeholder="Κωδικός" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">Είσοδος</Button>
      </form>
    </Card>
  );
}

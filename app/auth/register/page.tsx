"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!res.ok) { setError("Registration failed"); setLoading(false); return; }
    await signIn("credentials", { email, password, callbackUrl: "/manage" });
    router.push("/manage");
  }

  return <div className="px-6 py-12"><Card className="mx-auto max-w-md space-y-4"><h1 className="font-display text-3xl">Create account</h1><form onSubmit={submit} className="space-y-3"><Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/><Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required/>{error && <p className="text-sm text-red-300">{error}</p>}<Button type="submit" loading={loading} className="w-full">Register</Button></form></Card></div>;
}

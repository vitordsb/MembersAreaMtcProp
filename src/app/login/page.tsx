"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
      >
        <h1 className="text-2xl font-semibold">Entrar</h1>

        <label className="block space-y-1 text-sm">
          <span className="text-neutral-400">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-[color:var(--color-brand-green)]"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-neutral-400">Senha</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-[color:var(--color-brand-green)]"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[color:var(--color-brand-green)] py-2 font-medium text-neutral-950 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-800" />
          <span className="text-xs uppercase text-neutral-500">ou</span>
          <span className="h-px flex-1 bg-neutral-800" />
        </div>

        <GoogleSignInButton label="Entrar com Google" next="/dashboard" />

        <p className="text-center text-sm text-neutral-400">
          Não tem conta?{" "}
          <Link href="/signup" className="text-[color:var(--color-brand-green)] hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </main>
  );
}

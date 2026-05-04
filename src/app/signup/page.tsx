"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  // Usa o proxy interno do Next.js — evita mixed content (HTTPS → HTTP direto).
  const apiUrl = "/api/backend";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);

    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone: phone || null },
        emailRedirectTo,
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    const session = data.session;

    // Caso 1: confirmação de email é exigida — Supabase não retorna sessão.
    if (!session) {
      setLoading(false);
      setPendingEmail(email);
      startResendCooldown();
      return;
    }

    // Caso 2: confirmação desabilitada — já temos sessão; cria Student e redireciona.
    try {
      const res = await fetch(`${apiUrl}/members/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name, phone: phone || undefined }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Falha ao registrar Student: ${res.status} ${body}`);
      }
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Erro ao registrar");
      return;
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  function startResendCooldown() {
    setResendCooldown(45);
    const tick = () => {
      setResendCooldown((s) => {
        if (s <= 1) return 0;
        setTimeout(tick, 1000);
        return s - 1;
      });
    };
    setTimeout(tick, 1000);
  }

  async function handleResend() {
    if (!pendingEmail || resendCooldown > 0) return;
    setError(null);
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
      options: { emailRedirectTo },
    });
    if (resendError) {
      setError(resendError.message);
      return;
    }
    startResendCooldown();
  }

  if (pendingEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-5 rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-brand-green-soft)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[color:var(--color-brand-green)]">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Confirme seu email</h1>
            <p className="text-sm text-neutral-400">
              Enviamos um link de confirmação para <strong className="text-neutral-200">{pendingEmail}</strong>.
              Clique no link do email para ativar sua conta — você será redirecionado automaticamente.
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {resendCooldown > 0 ? `Reenviar email em ${resendCooldown}s` : "Reenviar email"}
            </button>
            <Link
              href="/login"
              className="block w-full rounded-md py-2 text-sm text-neutral-400 hover:text-neutral-200"
            >
              Voltar para login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
      >
        <h1 className="text-2xl font-semibold">Criar conta</h1>

        <label className="block space-y-1 text-sm">
          <span className="text-neutral-400">Nome completo</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-[color:var(--color-brand-green)]"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-neutral-400">Telefone (opcional)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+5511999999999"
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-[color:var(--color-brand-green)]"
          />
        </label>

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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 pr-10 outline-none focus:border-[color:var(--color-brand-green)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-200"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58a2 2 0 002.83 2.83" />
                  <path d="M16.68 16.68A9.66 9.66 0 0112 18c-5 0-9.27-3.11-11-7.5a13.13 13.13 0 013.83-5.17" />
                  <path d="M9.88 5.09A9.77 9.77 0 0112 5c5 0 9.27 3.11 11 7.5a13.16 13.16 0 01-2.16 3.19" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-neutral-400">Confirmar senha</span>
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-[color:var(--color-brand-green)]"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[color:var(--color-brand-green)] py-2 font-medium text-neutral-950 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-800" />
          <span className="text-xs uppercase text-neutral-500">ou</span>
          <span className="h-px flex-1 bg-neutral-800" />
        </div>

        <GoogleSignInButton label="Criar conta com Google" next="/dashboard" />

        <p className="text-center text-sm text-neutral-400">
          Já tem conta?{" "}
          <Link href="/login" className="text-[color:var(--color-brand-green)] hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}

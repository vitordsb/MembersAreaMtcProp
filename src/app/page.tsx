import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ code?: string; next?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { code, next } = await searchParams;

  // Quando o link de confirmação de email da Supabase volta para a raiz, encaminha
  // para /auth/callback que troca o code pela sessão.
  if (code) {
    const target = `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next ?? "/dashboard")}`;
    redirect(target);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-12">
      <h1 className="text-4xl font-bold">
        MTCprop — <span className="text-[color:var(--color-brand-green)]">Membros</span>
      </h1>
      <p className="max-w-md text-center text-neutral-400">
        Acesse seu plano, módulos e progresso na mesa proprietária.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-md bg-[color:var(--color-brand-green)] px-6 py-3 font-medium text-neutral-950 transition hover:opacity-90"
        >
          Entrar
        </Link>
        <Link
          href="/signup"
          className="rounded-md border border-[color:var(--color-brand-green)] px-6 py-3 font-medium text-[color:var(--color-brand-green)] transition hover:bg-[color:var(--color-brand-green)] hover:text-neutral-950"
        >
          Criar conta
        </Link>
      </div>
    </main>
  );
}

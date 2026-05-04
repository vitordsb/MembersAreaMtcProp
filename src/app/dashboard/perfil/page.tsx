import { apiFetch } from "@/lib/api/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  stage: string;
  isActive: boolean;
}

export default async function PerfilPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let student: Student | null = null;
  let fetchError: string | null = null;
  try {
    student = await apiFetch<Student>("/members/me");
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Erro ao buscar perfil";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Meu perfil</h1>
        <p className="mt-1 text-sm text-neutral-400">Seus dados na MTCprop</p>
      </header>

      {fetchError ? (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-6">
          <h2 className="text-lg font-semibold text-red-300">Não foi possível carregar</h2>
          <p className="mt-2 text-sm text-red-300/80">{fetchError}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] p-6">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <Field label="Nome" value={student?.name} />
            <Field label="Email" value={student?.email ?? user?.email ?? ""} />
            <Field label="Telefone" value={student?.phone ?? "—"} />
            <Field label="Estágio" value={student?.stage} />
            <Field label="Status" value={student?.isActive ? "Ativo" : "Inativo"} />
          </dl>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-1 text-sm text-neutral-100">{value || "—"}</dd>
    </div>
  );
}

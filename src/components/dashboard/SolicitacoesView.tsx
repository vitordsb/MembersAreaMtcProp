"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
  Unlock,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type SolicitacaoType =
  | "APROVACAO"
  | "LIBERACAO_PLATAFORMA"
  | "MIGRACAO_MESA_REAL"
  | "RESET_GRATUITO"
  | "REPASSE";

type SolicitacaoStatus = "PENDENTE" | "APROVADA" | "REJEITADA" | "CONCLUIDA";

interface Solicitacao {
  id: string;
  type: SolicitacaoType;
  status: SolicitacaoStatus;
  masterAccount: string | null;
  document: string | null;
  message: string | null;
  adminNotes: string | null;
  decidedAt: string | null;
  createdAt: string;
}

interface Props {
  initialList: Solicitacao[];
  fetchError: string | null;
}

const TYPE_INFO: Record<SolicitacaoType, { label: string; description: string; icon: typeof Send; color: string }> = {
  APROVACAO: {
    label: "Aprovação",
    description: "Solicite a aprovação da sua mesa após atingir as metas.",
    icon: CheckCircle,
    color: "text-emerald-400",
  },
  LIBERACAO_PLATAFORMA: {
    label: "Liberação de Plataforma",
    description: "Peça para liberar/reativar sua plataforma de operação.",
    icon: Unlock,
    color: "text-sky-400",
  },
  MIGRACAO_MESA_REAL: {
    label: "Migração para Mesa Real",
    description: "Já está no remunerado e quer migrar para a Mesa Real.",
    icon: TrendingUp,
    color: "text-[color:var(--color-brand-green)]",
  },
  RESET_GRATUITO: {
    label: "Reset Gratuito",
    description: "Solicite o reset dos seus limites de risco (1x por ciclo).",
    icon: RefreshCw,
    color: "text-amber-400",
  },
  REPASSE: {
    label: "Repasse",
    description: "Solicite o repasse dos resultados da sua mesa real.",
    icon: Sparkles,
    color: "text-fuchsia-400",
  },
};

const STATUS_INFO: Record<SolicitacaoStatus, { label: string; icon: typeof Clock; className: string }> = {
  PENDENTE: { label: "Pendente", icon: Clock, className: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  APROVADA: { label: "Aprovada", icon: CheckCircle, className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  REJEITADA: { label: "Rejeitada", icon: XCircle, className: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  CONCLUIDA: { label: "Concluída", icon: Sparkles, className: "bg-[color:var(--color-brand-green-soft)] text-[color:var(--color-brand-green)] border-[color:var(--color-brand-green-dim)]" },
};

export default function SolicitacoesView({ initialList, fetchError }: Props) {
  const [list, setList] = useState<Solicitacao[]>(initialList);
  const [openType, setOpenType] = useState<SolicitacaoType | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(type: SolicitacaoType) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/backend/members/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message: message || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Erro ${res.status}`);
      }
      const created: Solicitacao = await res.json();
      setList((prev) => [created, ...prev]);
      setOpenType(null);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar solicitação");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Solicitações</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Peça aprovação, liberação, reset, migração ou repasse para a equipe MTCprop.
        </p>
      </header>

      {fetchError && (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          {fetchError}
        </div>
      )}

      {/* Tipos disponíveis */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Nova solicitação</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(TYPE_INFO) as [SolicitacaoType, typeof TYPE_INFO[SolicitacaoType]][]).map(
            ([type, info]) => {
              const Icon = info.icon;
              const isOpen = openType === type;
              return (
                <div
                  key={type}
                  className="flex flex-col rounded-xl border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] p-4 transition hover:border-[color:var(--color-border)]"
                >
                  <Icon className={`h-5 w-5 ${info.color}`} />
                  <h3 className="mt-3 font-semibold">{info.label}</h3>
                  <p className="mt-1 text-xs text-neutral-400">{info.description}</p>

                  {isOpen ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Mensagem (opcional)..."
                        className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm outline-none focus:border-[color:var(--color-brand-green)]"
                      />
                      {error && <p className="text-xs text-red-400">{error}</p>}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSubmit(type)}
                          disabled={submitting}
                          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[color:var(--color-brand-green)] py-1.5 text-sm font-medium text-neutral-950 transition hover:opacity-90 disabled:opacity-60"
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenType(null);
                            setMessage("");
                            setError(null);
                          }}
                          className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenType(type);
                        setError(null);
                      }}
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-md border border-neutral-700 py-1.5 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800"
                    >
                      Solicitar
                    </button>
                  )}
                </div>
              );
            },
          )}
        </div>
      </section>

      {/* Histórico */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Minhas solicitações</h2>

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-10 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-neutral-500" />
            <p className="mt-3 text-sm text-neutral-400">Nenhuma solicitação ainda.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {list.map((s) => {
              const tInfo = TYPE_INFO[s.type];
              const sInfo = STATUS_INFO[s.status];
              const StatusIcon = sInfo.icon;
              return (
                <li
                  key={s.id}
                  className="rounded-xl border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{tInfo.label}</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${sInfo.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {sInfo.label}
                        </span>
                      </div>
                      {s.message && (
                        <p className="text-sm text-neutral-300">“{s.message}”</p>
                      )}
                      {s.adminNotes && (
                        <p className="text-xs text-neutral-400">
                          <strong className="text-neutral-200">Admin:</strong> {s.adminNotes}
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      {new Date(s.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

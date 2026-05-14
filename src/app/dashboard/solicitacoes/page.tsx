import SolicitacoesView from "@/components/dashboard/SolicitacoesView";
import { apiFetch } from "@/lib/api/client";

interface Solicitacao {
  id: string;
  type: "APROVACAO" | "LIBERACAO_PLATAFORMA" | "MIGRACAO_MESA_REAL" | "RESET_GRATUITO" | "REPASSE";
  status: "PENDENTE" | "APROVADA" | "REJEITADA" | "CONCLUIDA";
  masterAccount: string | null;
  document: string | null;
  message: string | null;
  adminNotes: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export default async function SolicitacoesPage() {
  let solicitacoes: Solicitacao[] = [];
  let fetchError: string | null = null;
  try {
    solicitacoes = await apiFetch<Solicitacao[]>("/members/solicitacoes/me");
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Erro ao buscar solicitações";
  }

  return <SolicitacoesView initialList={solicitacoes} fetchError={fetchError} />;
}

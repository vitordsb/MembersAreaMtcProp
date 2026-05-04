import Carousel from "@/components/dashboard/Carousel";
import FeatureCard from "@/components/dashboard/FeatureCard";

export default function DashboardHomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Início</h1>
        <p className="mt-1 text-sm text-neutral-400">Bem vindo ao painel do Trader</p>
      </header>

      <Carousel
        title="Benefícios"
        subtitle="Saiba o que é e como usar a Aprovação Permanente"
      >
        <FeatureCard
          title="Aprovação Permanente"
          subtitle="Sua volta para mesa"
          href="/dashboard/planos"
          badge={
            <span className="block leading-tight">
              APROVAÇÃO
              <br />
              PERMANENTE
            </span>
          }
        />
        <FeatureCard
          title="Plano Avançado"
          subtitle="Aumente seu limite de contratos"
          href="/dashboard/planos"
          badge={<span>PLANO AVANÇADO</span>}
          accent="#22d3ee"
        />
        <FeatureCard
          title="Mentoria 1:1"
          subtitle="Acompanhamento direto com mentores"
          href="/dashboard/academy"
          badge={<span>MENTORIA</span>}
          accent="#f59e0b"
        />
      </Carousel>

      <Carousel
        title="Conteúdos MTCprop"
        subtitle="Conteúdos informativos e educacionais para membros."
      >
        <FeatureCard
          title="Leitura Macroeconômica"
          subtitle="Análises semanais do mercado"
          href="/dashboard/academy"
          badge={<span>LEITURA<br />MACROECONÔMICA</span>}
          accent="#a78bfa"
        />
        <FeatureCard
          title="Ecossistema MTCprop"
          subtitle="Conheça toda a estrutura"
          href="/dashboard/academy"
          badge={<span>ECOSSISTEMA<br />MTCprop</span>}
        />
        <FeatureCard
          title="Webinars"
          subtitle="Sessões ao vivo com traders aprovados"
          href="/dashboard/academy"
          badge={<span>WEBINARS</span>}
          accent="#22d3ee"
        />
      </Carousel>
    </div>
  );
}

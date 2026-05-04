import Link from "next/link";

interface Props {
  title: string;
  subtitle?: string;
  href: string;
  /** Cor de destaque do card. Default: brand green. */
  accent?: string;
  /** Ícone/figura central opcional (Component ou texto curto). */
  badge?: React.ReactNode;
}

export default function FeatureCard({
  title,
  subtitle,
  href,
  accent = "var(--color-brand-green)",
  badge,
}: Props) {
  return (
    <Link
      href={href}
      className="group relative flex aspect-[16/10] w-[420px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] p-5 transition hover:border-[color:var(--color-border)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 transition group-hover:opacity-50"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${accent}40, transparent 60%), repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 24px)`,
        }}
      />
      {badge && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] text-center font-[family-name:var(--font-unbounded)] text-2xl font-bold uppercase tracking-tight text-neutral-100/90">
          {badge}
        </div>
      )}
      <div className="relative">
        <h3 className="font-[family-name:var(--font-unbounded)] text-base font-bold uppercase tracking-tight text-neutral-100">
          {title}
        </h3>
        {subtitle && <p className="mt-1 text-xs text-neutral-400">{subtitle}</p>}
      </div>
    </Link>
  );
}

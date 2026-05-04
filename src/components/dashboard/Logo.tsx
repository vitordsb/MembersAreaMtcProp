interface Props {
  collapsed?: boolean;
}

export default function Logo({ collapsed = false }: Props) {
  if (collapsed) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--color-brand-green)] text-[15px] font-bold tracking-tight text-neutral-950">
        M
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-0 font-[family-name:var(--font-unbounded)] text-xl font-bold tracking-tight">
      <span className="text-neutral-100">MTC</span>
      <span className="text-[color:var(--color-brand-green)]">prop</span>
    </div>
  );
}

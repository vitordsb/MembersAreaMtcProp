interface Props {
  title: string;
  description: string;
}

export default function PageStub({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-neutral-400">{description}</p>
      </header>
      <div className="rounded-xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-10 text-center">
        <p className="text-sm text-neutral-500">Em construção</p>
      </div>
    </div>
  );
}

import { AlertTriangle, Sun } from "lucide-react";
import UserMenu from "./UserMenu";

interface Props {
  email: string;
  name: string;
}

export default function TopBar({ email, name }: Props) {
  return (
    <header className="flex h-16 items-center justify-end gap-3 border-b border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-6">
      <button
        type="button"
        aria-label="Alternar tema"
        className="rounded-md p-2 text-neutral-400 hover:bg-[color:var(--color-surface-2)] hover:text-neutral-100"
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Alertas"
        className="rounded-md p-2 text-neutral-400 hover:bg-[color:var(--color-surface-2)] hover:text-neutral-100"
      >
        <AlertTriangle className="h-5 w-5" />
      </button>
      <span className="mx-1 h-6 w-px bg-[color:var(--color-border-soft)]" />
      <UserMenu email={email} name={name} />
    </header>
  );
}

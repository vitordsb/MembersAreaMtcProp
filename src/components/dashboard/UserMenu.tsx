"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  email: string;
  name: string;
}

export default function UserMenu({ email, name }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = (name || email).slice(0, 1).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] py-1.5 pl-1.5 pr-3 text-sm hover:border-[color:var(--color-border)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-brand-green-soft)] text-xs font-semibold text-[color:var(--color-brand-green)]">
          {initial}
        </span>
        <span className="max-w-[140px] truncate text-neutral-200">{name || email}</span>
        <ChevronDown className="h-4 w-4 text-neutral-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] shadow-xl">
          <div className="border-b border-[color:var(--color-border-soft)] px-4 py-3">
            <p className="truncate text-sm text-neutral-100">{name || "Trader"}</p>
            <p className="truncate text-xs text-neutral-500">{email}</p>
          </div>
          <Link
            href="/dashboard/perfil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-[color:var(--color-surface-3)]"
          >
            <User className="h-4 w-4" />
            Meu perfil
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[color:var(--color-surface-3)]"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

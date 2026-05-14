"use client";

import {
  Award,
  ChevronDown,
  ClipboardList,
  FileText,
  Gamepad2,
  GraduationCap,
  Home,
  PanelLeft,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Meus Planos", href: "/dashboard/planos", icon: TrendingUp },
  { label: "Solicitações", href: "/dashboard/solicitacoes", icon: ClipboardList },
  { label: "Meus certificados", href: "/dashboard/certificados", icon: Award },
  { label: "Termos Aceitos", href: "/dashboard/termos", icon: FileText },
  {
    label: "Financeiro",
    href: "/dashboard/financeiro",
    icon: Wallet,
    children: [
      { label: "Mensalidades", href: "/dashboard/financeiro/mensalidades" },
      { label: "Histórico", href: "/dashboard/financeiro/historico" },
    ],
  },
  { label: "Gamification", href: "/dashboard/gamification", icon: Gamepad2 },
  { label: "Academy", href: "/dashboard/academy", icon: GraduationCap },
  { label: "MTCprop AI", href: "/dashboard/ai", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={`flex h-screen flex-col border-r border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] transition-all ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Logo collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Recolher menu"
          className="rounded-md p-1.5 text-neutral-400 hover:bg-[color:var(--color-surface-3)] hover:text-neutral-100"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const hasChildren = !!item.children?.length;
          const open = openGroups[item.href] ?? active;

          if (hasChildren) {
            return (
              <div key={item.href}>
                <button
                  type="button"
                  onClick={() => setOpenGroups((g) => ({ ...g, [item.href]: !open }))}
                  className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[color:var(--color-brand-green-soft)] text-[color:var(--color-brand-green)]"
                      : "text-neutral-300 hover:bg-[color:var(--color-surface-3)] hover:text-neutral-100"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>
                {open && !collapsed && (
                  <div className="ml-9 mt-0.5 space-y-0.5 border-l border-[color:var(--color-border-soft)] pl-3">
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block rounded-md px-3 py-1.5 text-sm transition ${
                          pathname === child.href
                            ? "text-[color:var(--color-brand-green)]"
                            : "text-neutral-400 hover:text-neutral-100"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-[color:var(--color-brand-green-soft)] text-[color:var(--color-brand-green)]"
                  : "text-neutral-300 hover:bg-[color:var(--color-surface-3)] hover:text-neutral-100"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

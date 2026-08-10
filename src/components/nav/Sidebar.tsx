"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActive } from "./nav-links";
import { getCreateAction } from "./create-action";
import type { MateriaResumo } from "@/lib/data";

export function Sidebar({ materiasEmUso }: { materiasEmUso: MateriaResumo[] }) {
  const pathname = usePathname();
  const createAction = getCreateAction(pathname);

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col gap-1 border-r border-border bg-surface px-3.5 py-4">
      <div className="mb-4 flex items-center gap-2 px-1.5 text-[15px] font-extrabold">
        <span>📚</span>
        <span>Estudo+</span>
      </div>

      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold ${
              active ? "bg-accent/15 text-accent" : "text-text-dim hover:bg-surface-2"
            }`}
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}

      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3.5">
        <p className="px-1.5 text-[10.5px] font-bold uppercase tracking-wide text-text-dim">
          Matérias em uso
        </p>
        {materiasEmUso.length === 0 ? (
          <p className="px-1.5 text-xs italic text-text-dim">Nenhuma no calendário ainda.</p>
        ) : (
          materiasEmUso.map((m) => (
            <div key={m.id} className="flex items-center gap-2 px-1.5 text-xs text-text-dim">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: m.cor }}
                aria-hidden
              />
              {m.nome}
            </div>
          ))
        )}
      </div>

      {createAction && (
        <Link
          href={createAction.href}
          className="mt-auto rounded-lg bg-accent px-3 py-2.5 text-center text-[13px] font-bold text-accent-text"
        >
          + {createAction.label}
        </Link>
      )}
    </aside>
  );
}

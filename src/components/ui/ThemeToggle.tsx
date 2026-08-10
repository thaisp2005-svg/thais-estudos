"use client";

import { useState, useTransition } from "react";
import { setTemaAction } from "@/lib/actions";
import type { Tema } from "@/lib/supabase/types";

export function ThemeToggle({ temaInicial }: { temaInicial: Tema }) {
  const [mode, setMode] = useState<Tema>(temaInicial);
  const [, startTransition] = useTransition();

  function apply(next: Tema) {
    setMode(next);
    if (next === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", next);
    startTransition(() => {
      setTemaAction(next);
    });
  }

  const options: { key: Tema; label: string }[] = [
    { key: "light", label: "Claro" },
    { key: "dark", label: "Escuro" },
    { key: "auto", label: "Automático" },
  ];

  return (
    <div className="inline-flex gap-0.5 rounded-full border border-border bg-surface-2 p-[3px]">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => apply(opt.key)}
          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${
            mode === opt.key ? "bg-surface text-text shadow-sm" : "text-text-dim"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

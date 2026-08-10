"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleEventoAction } from "@/lib/actions";
import { isAtrasado, nomeMes } from "@/lib/date";

export type ItemAgenda = {
  id: string;
  titulo: string;
  materia: string | null;
  cor: string;
  status: "pendente" | "feito";
  data: string;
  conteudo_id?: string | null;
  horario_inicio?: string | null;
  horario_fim?: string | null;
};

export function DayItemRow({
  item,
  mostrarData,
  semLink,
  acaoExcluir,
}: {
  item: ItemAgenda;
  mostrarData?: boolean;
  semLink?: boolean;
  /** quando informada, mostra um botão de excluir só este item (ex: uma revisão avulsa) */
  acaoExcluir?: (formData: FormData) => void;
}) {
  const [feito, setFeito] = useState(item.status === "feito");
  const [, startTransition] = useTransition();
  const atrasado = isAtrasado(item.data, feito ? "feito" : "pendente");

  // revisões abrem o conteúdo de estudo; tarefas/compromissos abrem a edição
  const href = item.conteudo_id ? `/estudos/${item.conteudo_id}` : `/agenda/evento/${item.id}`;

  const titulo = <span className="truncate text-[13.5px] font-bold leading-tight">{item.titulo}</span>;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 ${
        atrasado ? "border-danger bg-danger-bg" : "border-transparent bg-surface-2"
      }`}
    >
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.cor }} aria-hidden />

      <div className="min-w-0 flex-1">
        {semLink ? (
          <div className="min-w-0">{titulo}</div>
        ) : (
          <Link href={href} className="block min-w-0 hover:underline">
            {titulo}
          </Link>
        )}
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-text-dim">
          {mostrarData && (
            <span className="rounded-md border border-border bg-surface px-1.5 py-px text-[10px] font-bold">
              {Number(item.data.slice(8, 10))} {nomeMes(Number(item.data.slice(5, 7))).slice(0, 3)}
            </span>
          )}
          {item.horario_inicio && (
            <span className="font-semibold text-text">
              {item.horario_inicio.slice(0, 5)}
              {item.horario_fim ? `–${item.horario_fim.slice(0, 5)}` : ""}
            </span>
          )}
          {item.materia && <span>{item.materia}</span>}
          {atrasado && (
            <span className="rounded-full bg-danger px-1.5 py-px text-[10px] font-bold text-white">Atrasada</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const novo = !feito;
          setFeito(novo);
          startTransition(() => {
            toggleEventoAction(item.id, novo);
          });
        }}
        aria-pressed={feito}
        aria-label={feito ? "Marcar como não feito" : "Marcar como feito"}
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border text-xs ${
          feito ? "border-accent bg-accent text-accent-text" : "border-border bg-surface text-transparent"
        }`}
      >
        ✓
      </button>

      {acaoExcluir && (
        <form action={acaoExcluir}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            onClick={(e) => {
              if (!window.confirm(`Excluir "${item.titulo}"?`)) e.preventDefault();
            }}
            aria-label="Excluir"
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-border text-[11px] text-text-dim hover:border-danger hover:text-danger"
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
}

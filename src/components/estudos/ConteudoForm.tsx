"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Field, inputClass } from "@/components/ui/Field";
import { createConteudoAction, updateConteudoAction } from "@/lib/actions";
import { hojeISO, rotuloIntervalo } from "@/lib/date";
import type { MateriaResumo } from "@/lib/data";

type Plano = { id: string; nome: string; intervalos_dias: number[] };

export type ConteudoInicial = {
  id: string;
  titulo: string;
  materia_id: string;
  observacoes: string | null;
  data_inicial: string;
  plano_revisao_id: string | null;
};

export function ConteudoForm({
  planos,
  materias,
  inicial,
}: {
  planos: Plano[];
  materias: MateriaResumo[];
  inicial?: ConteudoInicial;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // volta do "+ Nova matéria" já com ela selecionada
  const materiaRecemCriada = searchParams.get("materia");

  const [planoId, setPlanoId] = useState(inicial?.plano_revisao_id ?? planos[0]?.id ?? "");
  const [materiaId, setMateriaId] = useState(
    materiaRecemCriada ?? inicial?.materia_id ?? materias[0]?.id ?? ""
  );
  const editando = Boolean(inicial);
  const novaMateriaHref = `/materias/novo?voltar_para=${encodeURIComponent(pathname)}`;

  return (
    <form action={editando ? updateConteudoAction : createConteudoAction} className="flex flex-col gap-4">
      {inicial && <input type="hidden" name="id" value={inicial.id} />}

      <Field label="Título do conteúdo">
        <input
          type="text"
          name="titulo"
          required
          defaultValue={inicial?.titulo}
          placeholder="ex: Farmacologia — antibióticos"
          className={inputClass}
        />
      </Field>

      <Field label="Matéria">
        {materias.length === 0 ? (
          <Link
            href={novaMateriaHref}
            className="block rounded-lg border border-dashed border-border bg-surface-2 px-2.5 py-2.5 text-center text-[13px] font-semibold text-accent"
          >
            + Cadastrar a primeira matéria
          </Link>
        ) : (
          <>
            <div className="flex max-h-[168px] flex-col gap-1.5 overflow-y-auto rounded-lg border border-border p-1.5">
              {materias.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMateriaId(m.id)}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] font-semibold ${
                    materiaId === m.id ? "bg-accent/15 text-accent" : "text-text hover:bg-surface-2"
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.cor }} aria-hidden />
                  {m.nome}
                </button>
              ))}
            </div>
            <input type="hidden" name="materia_id" value={materiaId} />
            <Link href={novaMateriaHref} className="mt-1.5 inline-block text-[12px] font-bold text-accent">
              + Nova matéria
            </Link>
          </>
        )}
      </Field>

      <Field
        label="Data inicial"
        hint={editando ? "Mudar a data recalcula as revisões que ainda não foram feitas." : undefined}
      >
        <input
          type="date"
          name="data_inicial"
          required
          defaultValue={inicial?.data_inicial ?? hojeISO()}
          className={inputClass}
        />
      </Field>

      <Field
        label="Plano de revisão"
        hint={editando ? "Trocar o plano preserva as revisões já feitas e recalcula as pendentes." : undefined}
      >
        <div className="flex flex-wrap gap-2">
          {planos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlanoId(p.id)}
              className={`min-w-[110px] flex-1 rounded-lg border px-2 py-2 text-left text-xs font-semibold ${
                planoId === p.id ? "border-accent bg-accent/15 text-accent" : "border-border bg-surface-2 text-text-dim"
              }`}
            >
              <b className="block text-[13px] text-text">{p.nome}</b>
              {p.intervalos_dias.map((d) => (d === 1 ? "24h" : `${d}d`)).join(" · ")}
            </button>
          ))}
          <Link
            href="/configuracoes"
            className="min-w-[110px] flex-1 rounded-lg border border-dashed border-border px-2 py-2 text-left text-xs font-semibold text-text-dim"
          >
            <b className="block text-[13px] text-text">+ Criar plano</b>
            nas configurações
          </Link>
        </div>
        <input type="hidden" name="plano_revisao_id" value={planoId} />
        {planos.find((p) => p.id === planoId) && (
          <span className="mt-2 block text-[11.5px] text-text-dim">
            Revisões:{" "}
            {planos
              .find((p) => p.id === planoId)!
              .intervalos_dias.map(rotuloIntervalo)
              .join(", ")}{" "}
            após a data inicial.
          </span>
        )}
      </Field>

      <Field label="Observações">
        <textarea
          name="observacoes"
          rows={3}
          defaultValue={inicial?.observacoes ?? ""}
          placeholder="opcional"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <button
        type="submit"
        disabled={materias.length === 0}
        className="mt-2 rounded-xl bg-accent py-3 text-sm font-bold text-accent-text disabled:opacity-50"
      >
        {editando ? "Salvar alterações" : "Salvar conteúdo"}
      </button>
    </form>
  );
}

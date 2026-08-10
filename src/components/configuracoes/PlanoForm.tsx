"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/ui/Field";
import { createPlanoAction, updatePlanoAction } from "@/lib/actions";
import { rotuloIntervalo } from "@/lib/date";

export type PlanoInicial = { id: string; nome: string; intervalos_dias: number[] };

export function PlanoForm({ inicial }: { inicial?: PlanoInicial }) {
  const [intervalos, setIntervalos] = useState<string[]>(
    inicial ? inicial.intervalos_dias.map(String) : ["1", "7", "30"]
  );
  const editando = Boolean(inicial);

  function alterar(i: number, valor: string) {
    setIntervalos((cur) => cur.map((v, idx) => (idx === i ? valor : v)));
  }

  const previa = intervalos
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .sort((a, b) => a - b);

  return (
    <form action={editando ? updatePlanoAction : createPlanoAction} className="flex flex-col gap-4">
      {inicial && <input type="hidden" name="id" value={inicial.id} />}

      <Field label="Nome do plano">
        <input
          type="text"
          name="nome"
          required
          defaultValue={inicial?.nome}
          placeholder="ex: Plano intensivo"
          className={inputClass}
        />
      </Field>

      <Field label="Intervalos (em dias após a data inicial)" hint="Um campo por revisão. Ex: 1, 3, 7, 21.">
        <div className="flex flex-col gap-2">
          {intervalos.map((valor, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-[11.5px] font-semibold text-text-dim">{i + 1}ª revisão</span>
              <input
                type="number"
                name="intervalo"
                min={1}
                required
                value={valor}
                onChange={(e) => alterar(i, e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setIntervalos((cur) => cur.filter((_, idx) => idx !== i))}
                disabled={intervalos.length === 1}
                aria-label={`Remover ${i + 1}ª revisão`}
                className="shrink-0 rounded-lg border border-border px-2.5 py-2 text-sm text-text-dim disabled:opacity-40"
              >
                −
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIntervalos((cur) => [...cur, ""])}
          className="mt-2 w-full rounded-lg border-[1.5px] border-dashed border-border py-2 text-[13px] font-semibold text-text-dim"
        >
          + Adicionar revisão
        </button>
      </Field>

      {previa.length > 0 && (
        <p className="rounded-lg bg-surface-2 px-3 py-2.5 text-[12.5px] text-text-dim">
          Este plano gera <b className="text-text">{previa.length} revisões</b>:{" "}
          {previa.map(rotuloIntervalo).join(" · ")}.
        </p>
      )}

      <button type="submit" className="mt-1 rounded-xl bg-accent py-3 text-sm font-bold text-accent-text">
        {editando ? "Salvar alterações" : "Criar plano"}
      </button>
    </form>
  );
}

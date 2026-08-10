"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/ui/Field";
import { createCompromissoAction, updateEventoAction } from "@/lib/actions";
import { COR_AVULSO } from "@/lib/palette";
import { OPCOES_REPETICAO, type Repeticao } from "@/lib/date";

const TIPOS = [
  { key: "tarefa", label: "Tarefa" },
  { key: "compromisso", label: "Compromisso" },
] as const;

export type EventoInicial = {
  id: string;
  tipo: "tarefa" | "compromisso";
  titulo: string;
  data: string;
  observacoes: string | null;
  horario_inicio: string | null;
  horario_fim: string | null;
};

function horaCurta(hhmmss: string | null) {
  return hhmmss ? hhmmss.slice(0, 5) : "";
}

export function EventoForm({ data, inicial }: { data: string; inicial?: EventoInicial }) {
  const [tipo, setTipo] = useState<"tarefa" | "compromisso">(inicial?.tipo ?? "tarefa");
  const [repete, setRepete] = useState<Repeticao>("nunca");
  const editando = Boolean(inicial);

  return (
    <form action={editando ? updateEventoAction : createCompromissoAction} className="flex flex-col gap-4">
      {inicial && <input type="hidden" name="id" value={inicial.id} />}

      <Field label="Tipo">
        <div className="flex gap-2">
          {TIPOS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTipo(t.key)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                tipo === t.key ? "border-accent bg-accent/15 text-accent" : "border-border bg-surface-2 text-text-dim"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="tipo" value={tipo} />
      </Field>

      <Field label="Título">
        <input
          type="text"
          name="titulo"
          required
          defaultValue={inicial?.titulo}
          placeholder="ex: Reunião com orientador"
          className={inputClass}
        />
      </Field>

      <Field label="Data">
        <input type="date" name="data" required defaultValue={inicial?.data ?? data} className={inputClass} />
      </Field>

      <div className="flex gap-3">
        <div className="flex-1">
          <Field label="Início">
            <input
              type="time"
              name="horario_inicio"
              defaultValue={horaCurta(inicial?.horario_inicio ?? null)}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="Fim">
            <input
              type="time"
              name="horario_fim"
              defaultValue={horaCurta(inicial?.horario_fim ?? null)}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      {!editando && (
        <Field label="Repete" hint="Cria uma ocorrência independente para cada data (até 1 ano à frente).">
          <select
            name="repete"
            value={repete}
            onChange={(e) => setRepete(e.target.value as Repeticao)}
            className={inputClass}
          >
            {OPCOES_REPETICAO.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
          {repete === "personalizado" && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[12.5px] text-text-dim">A cada</span>
              <input
                type="number"
                name="intervalo_personalizado"
                min={1}
                defaultValue={1}
                className={`${inputClass} w-20`}
              />
              <span className="text-[12.5px] text-text-dim">dia(s)</span>
            </div>
          )}
        </Field>
      )}

      <Field label="Observações">
        <textarea
          name="observacoes"
          rows={3}
          defaultValue={inicial?.observacoes ?? ""}
          placeholder="opcional"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <p className="flex items-center gap-2 text-xs text-text-dim">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COR_AVULSO }} aria-hidden />
        Itens avulsos como este aparecem sempre em cinza na agenda.
      </p>

      <button type="submit" className="mt-1 rounded-xl bg-accent py-3 text-sm font-bold text-accent-text">
        {editando ? "Salvar alterações" : "Salvar"}
      </button>
    </form>
  );
}

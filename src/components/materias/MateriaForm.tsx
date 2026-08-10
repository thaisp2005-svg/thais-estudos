"use client";

import { ColorPicker } from "@/components/estudos/ColorPicker";
import { Field, inputClass } from "@/components/ui/Field";
import { createMateriaAction, updateMateriaAction } from "@/lib/actions";
import { EVENT_PALETTE } from "@/lib/palette";

export type MateriaInicial = { id: string; nome: string; cor: string };

export function MateriaForm({ inicial }: { inicial?: MateriaInicial }) {
  const editando = Boolean(inicial);

  return (
    <form action={editando ? updateMateriaAction : createMateriaAction} className="flex flex-col gap-4">
      {inicial && <input type="hidden" name="id" value={inicial.id} />}

      <Field label="Nome da matéria">
        <input
          type="text"
          name="nome"
          required
          defaultValue={inicial?.nome}
          placeholder="ex: Farmacologia"
          className={inputClass}
        />
      </Field>

      <Field label="Cor">
        <ColorPicker name="cor" defaultColor={inicial?.cor ?? EVENT_PALETTE[4].hex} />
      </Field>

      <button type="submit" className="mt-2 rounded-xl bg-accent py-3 text-sm font-bold text-accent-text">
        {editando ? "Salvar alterações" : "Criar matéria"}
      </button>
    </form>
  );
}

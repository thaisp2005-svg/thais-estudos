import type { MateriaResumo } from "@/lib/data";

/**
 * Legenda "matéria → cor" para quem está olhando o calendário.
 * No computador essa mesma informação já aparece na barra lateral, então isso
 * só é mostrado no celular (onde não existe barra lateral).
 */
export function MateriasLegend({ materias }: { materias: MateriaResumo[] }) {
  if (materias.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-border bg-surface p-3.5 md:hidden">
      <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-text-dim">Matérias em uso</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {materias.map((m) => (
          <div key={m.id} className="flex items-center gap-1.5 text-xs text-text-dim">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.cor }} aria-hidden />
            {m.nome}
          </div>
        ))}
      </div>
    </div>
  );
}

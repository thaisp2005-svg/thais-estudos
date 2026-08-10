import Link from "next/link";
import { getMaterias } from "@/lib/data";

export default async function MateriasPage() {
  const materias = await getMaterias();

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-bold">Matérias</h1>
        <Link
          href="/materias/novo"
          className="hidden rounded-lg bg-accent px-3.5 py-2 text-[13px] font-bold text-accent-text md:block"
        >
          + Nova matéria
        </Link>
      </div>

      {materias.length === 0 ? (
        <p className="text-[13px] italic text-text-dim">
          Nenhuma matéria cadastrada ainda. Crie a primeira para poder escolhê-la ao cadastrar um conteúdo de
          estudo.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {materias.map((m) => (
            <Link
              key={m.id}
              href={`/materias/${m.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: m.cor }} aria-hidden />
              <span className="flex-1 text-[13.5px] font-bold">{m.nome}</span>
              <span className="text-[11.5px] font-semibold text-text-dim">Editar</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

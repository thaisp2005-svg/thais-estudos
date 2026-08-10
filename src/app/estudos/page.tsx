import Link from "next/link";
import { getConteudos } from "@/lib/data";
import { RevisoesResumo } from "@/components/estudos/RevisoesResumo";

export default async function EstudosPage() {
  const conteudos = await getConteudos();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-bold">Estudos</h1>
        <Link
          href="/estudos/novo"
          className="hidden rounded-lg bg-accent px-3.5 py-2 text-[13px] font-bold text-accent-text md:block"
        >
          + Novo conteúdo
        </Link>
      </div>

      {conteudos.length === 0 ? (
        <p className="text-[13px] italic text-text-dim">Nenhum conteúdo cadastrado ainda.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {conteudos.map((c) => (
            <Link
              key={c.id}
              href={`/estudos/${c.id}`}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{ background: c.materias?.cor ?? "#8A8D93" }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-bold">{c.titulo}</div>
                <div className="mt-0.5 text-[11.5px] text-text-dim">
                  {c.materias?.nome ?? "Sem matéria"} · iniciado em{" "}
                  {c.data_inicial.split("-").reverse().join("/")} · {c.planos_revisao?.nome ?? "—"}
                </div>
                <RevisoesResumo revisoes={c.eventos} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

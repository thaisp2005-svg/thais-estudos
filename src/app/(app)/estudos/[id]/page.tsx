import Link from "next/link";
import { notFound } from "next/navigation";
import { getConteudoDetalhe } from "@/lib/data";
import { DayItemRow } from "@/components/agenda/DayItemRow";
import { createRevisaoAvulsaAction, deleteRevisaoAction } from "@/lib/actions";
import { hojeISO, isAtrasado } from "@/lib/date";
import { COR_AVULSO } from "@/lib/palette";
import { inputClass } from "@/components/ui/Field";

export default async function ConteudoDetalhePage({ params }: PageProps<"/estudos/[id]">) {
  const { id } = await params;
  const resultado = await getConteudoDetalhe(id);
  if (!resultado) notFound();

  const { conteudo, eventos } = resultado;
  const cor = conteudo.materias?.cor ?? COR_AVULSO;
  const feitas = eventos.filter((e) => e.status === "feito").length;
  const atrasadas = eventos.filter((e) => isAtrasado(e.data, e.status)).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/estudos" className="text-sm font-semibold text-accent">
          ‹ Estudos
        </Link>
        <Link
          href={`/estudos/${id}/editar`}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12.5px] font-bold text-text-dim"
        >
          Editar
        </Link>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: cor }} aria-hidden />
        <h1 className="text-lg font-bold">{conteudo.titulo}</h1>
      </div>
      <p className="mt-1 text-[12.5px] text-text-dim">
        {conteudo.materias?.nome ?? "Sem matéria"} · iniciado em{" "}
        {conteudo.data_inicial.split("-").reverse().join("/")} · {conteudo.planos_revisao?.nome ?? "—"}
      </p>
      {conteudo.observacoes && <p className="mt-2 text-[13px] text-text-dim">{conteudo.observacoes}</p>}

      <div className="mt-4 flex flex-wrap gap-2 text-[11.5px] font-semibold">
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-text-dim">
          {feitas} de {eventos.length} revisões feitas
        </span>
        {atrasadas > 0 && (
          <span className="rounded-full bg-danger px-2.5 py-1 text-white">
            {atrasadas} atrasada{atrasadas > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <h2 className="mb-2.5 mt-6 text-xs font-extrabold uppercase tracking-wide text-text-dim">
        Histórico de revisões
      </h2>
      <div className="flex flex-col gap-2.5">
        {eventos.length === 0 ? (
          <p className="text-[12.5px] italic text-text-dim">Nenhuma revisão agendada.</p>
        ) : (
          eventos.map((ev) => (
            <DayItemRow
              key={ev.id}
              semLink
              item={{
                id: ev.id,
                titulo: ev.titulo,
                materia: conteudo.materias?.nome ?? null,
                cor,
                status: ev.status,
                data: ev.data,
              }}
              mostrarData
              acaoExcluir={deleteRevisaoAction}
            />
          ))
        )}
      </div>

      <section className="mt-8 rounded-xl border border-border bg-surface p-4">
        <h2 className="text-[13px] font-bold">Agendar revisão avulsa</h2>
        <p className="mt-1 text-[11.5px] text-text-dim">
          Cria uma revisão extra na data que você escolher, sem alterar o plano.
        </p>
        <form action={createRevisaoAvulsaAction} className="mt-3 flex flex-wrap items-center gap-2">
          <input type="hidden" name="conteudo_id" value={conteudo.id} />
          <input
            type="date"
            name="data"
            required
            defaultValue={hojeISO()}
            className={`${inputClass} w-auto flex-1`}
          />
          <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-[13px] font-bold text-accent-text">
            Agendar
          </button>
        </form>
      </section>
    </div>
  );
}

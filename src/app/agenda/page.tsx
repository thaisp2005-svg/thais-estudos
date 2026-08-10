import Link from "next/link";
import { MonthGrid } from "@/components/agenda/MonthGrid";
import { SeletorMesAno } from "@/components/agenda/SeletorMesAno";
import { VistaSwitcher } from "@/components/agenda/VistaSwitcher";
import { getEventosDoMes } from "@/lib/data";
import { hojeParts, mesAnterior, mesSeguinte, mesDeParams } from "@/lib/date";

export default async function AgendaPage({ searchParams }: PageProps<"/agenda">) {
  const { ano, mes } = mesDeParams(await searchParams);
  const eventosPorDia = await getEventosDoMes(ano, mes);
  const hoje = hojeParts();
  const anterior = mesAnterior(ano, mes);
  const seguinte = mesSeguinte(ano, mes);
  const noMesAtual = ano === hoje.ano && mes === hoje.mes;

  const setaClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-lg text-text-dim";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <SeletorMesAno ano={ano} mes={mes} modo="mes" />

        <div className="flex flex-wrap items-center gap-2">
          <VistaSwitcher ativa="mes" ano={ano} mes={mes} />
          <Link
            href={`/agenda?ano=${anterior.ano}&mes=${anterior.mes}`}
            aria-label="Mês anterior"
            className={setaClass}
          >
            ‹
          </Link>
          {!noMesAtual && (
            <Link
              href="/agenda"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-[12.5px] font-bold text-text-dim"
            >
              Hoje
            </Link>
          )}
          <Link
            href={`/agenda?ano=${seguinte.ano}&mes=${seguinte.mes}`}
            aria-label="Próximo mês"
            className={setaClass}
          >
            ›
          </Link>
          <Link
            href="/agenda/novo"
            className="rounded-lg bg-accent px-3 py-2 text-[12.5px] font-bold text-accent-text"
          >
            + Novo compromisso
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        <MonthGrid ano={ano} mes={mes} eventosPorDia={eventosPorDia} />
      </div>

      <p className="mt-4 px-1 text-[13px] text-text-dim">
        Toque em um dia para ver a lista de revisões, tarefas e compromissos.
      </p>
    </div>
  );
}

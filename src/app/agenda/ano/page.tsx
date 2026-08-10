import Link from "next/link";
import { MiniMonth } from "@/components/agenda/MiniMonth";
import { SeletorMesAno } from "@/components/agenda/SeletorMesAno";
import { VistaSwitcher } from "@/components/agenda/VistaSwitcher";
import { getMarcasDoAno } from "@/lib/data";
import { hojeParts, mesDeParams } from "@/lib/date";

export default async function AgendaAnoPage({ searchParams }: PageProps<"/agenda/ano">) {
  const params = await searchParams;
  const hoje = hojeParts();
  const { ano } = mesDeParams({ ano: params.ano, mes: String(hoje.mes) });
  const marcas = await getMarcasDoAno(ano);
  const noAnoAtual = ano === hoje.ano;

  const setaClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-lg text-text-dim";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SeletorMesAno ano={ano} modo="ano" />

        <div className="flex items-center gap-2">
          <VistaSwitcher ativa="ano" ano={ano} mes={hoje.mes} />
          <Link href={`/agenda/ano?ano=${ano - 1}`} aria-label="Ano anterior" className={setaClass}>
            ‹
          </Link>
          {!noAnoAtual && (
            <Link
              href="/agenda/ano"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-[12.5px] font-bold text-text-dim"
            >
              Hoje
            </Link>
          )}
          <Link href={`/agenda/ano?ano=${ano + 1}`} aria-label="Próximo ano" className={setaClass}>
            ›
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-7 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
          <MiniMonth key={mes} ano={ano} mes={mes} marcas={marcas} />
        ))}
      </div>

      <p className="mt-4 px-1 text-[13px] text-text-dim">
        O ponto embaixo do dia mostra que há algo marcado — vermelho quando tem revisão atrasada. Clique no nome
        do mês para abrir o mês inteiro, ou em um dia para ver a lista.
      </p>
    </div>
  );
}

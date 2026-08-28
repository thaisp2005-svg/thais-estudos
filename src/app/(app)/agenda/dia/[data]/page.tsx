import Link from "next/link";
import { getEventosDoDia } from "@/lib/data";
import { tituloDiaLongo } from "@/lib/date";
import { DayItemRow } from "@/components/agenda/DayItemRow";

export default async function DiaPage({ params }: PageProps<"/agenda/dia/[data]">) {
  const { data } = await params;
  const [anoStr, mesStr, diaStr] = data.split("-");
  const ano = Number(anoStr);
  const mes = Number(mesStr);
  const dia = Number(diaStr);
  const itens = await getEventosDoDia(data);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center justify-between">
        <Link href="/agenda" className="text-sm font-semibold text-accent">
          ‹ Voltar para o mês
        </Link>
        <Link
          href={`/agenda/novo?data=${data}`}
          className="rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-bold text-accent-text"
        >
          + Novo
        </Link>
      </div>
      <h1 className="mb-4 mt-2 text-[15px] font-bold">{tituloDiaLongo(ano, mes, dia)}</h1>
      <div className="flex flex-col gap-2.5">
        {itens.length === 0 ? (
          <p className="text-[12.5px] italic text-text-dim">Nenhum item para este dia.</p>
        ) : (
          itens.map((item) => <DayItemRow key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

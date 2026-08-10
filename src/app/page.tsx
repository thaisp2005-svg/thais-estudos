import { getPainel } from "@/lib/data";
import { DayItemRow } from "@/components/agenda/DayItemRow";
import { hojeParts, nomeMes } from "@/lib/date";

export default async function PainelPage() {
  const { atrasados, hoje } = await getPainel();
  const { dia, mes } = hojeParts();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-10">
      <h1 className="mb-5 text-lg font-bold">Painel</h1>

      <section className="mb-6">
        <h2 className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-danger">⚠ Atrasadas</h2>
        <div className="flex flex-col gap-2.5">
          {atrasados.length === 0 ? (
            <p className="text-[12.5px] italic text-text-dim">Nada atrasado. 🎉</p>
          ) : (
            atrasados.map((item) => <DayItemRow key={item.id} item={item} mostrarData />)
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-text-dim">
          Hoje · {dia} de {nomeMes(mes)}
        </h2>
        <div className="flex flex-col gap-2.5">
          {hoje.length === 0 ? (
            <p className="text-[12.5px] italic text-text-dim">Nenhum item para hoje.</p>
          ) : (
            hoje.map((item) => <DayItemRow key={item.id} item={item} />)
          )}
        </div>
      </section>
    </div>
  );
}

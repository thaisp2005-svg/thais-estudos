import Link from "next/link";
import { diasNoMes, primeiroDiaSemana, toISODate, hojeParts, nomeMes } from "@/lib/date";
import type { MarcaDia } from "@/lib/data";

const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MiniMonth({
  ano,
  mes,
  marcas,
}: {
  ano: number;
  mes: number;
  marcas: Map<string, MarcaDia>;
}) {
  const hoje = hojeParts();
  const total = diasNoMes(ano, mes);
  const offset = primeiroDiaSemana(ano, mes);
  const celulas = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  return (
    <div>
      <Link
        href={`/agenda?ano=${ano}&mes=${mes}`}
        className="mb-1.5 block text-[15px] font-bold capitalize hover:text-accent"
      >
        {nomeMes(mes)}
      </Link>

      <div className="grid grid-cols-7 text-center text-[10px] text-text-dim">
        {SEMANA.map((d, i) => (
          <div key={i} className="pb-0.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {celulas.map((dia, i) => {
          if (dia === null) return <div key={i} className="h-7" />;

          const dataISO = toISODate(ano, mes, dia);
          const marca = marcas.get(dataISO);
          const isHoje = ano === hoje.ano && mes === hoje.mes && dia === hoje.dia;

          return (
            <Link
              key={i}
              href={`/agenda/dia/${dataISO}`}
              className="flex h-7 flex-col items-center justify-center gap-[2px] rounded hover:bg-surface-2"
            >
              <span
                className={`flex h-[19px] w-[19px] items-center justify-center rounded-full text-[11.5px] tabular-nums ${
                  isHoje ? "bg-today font-bold text-white" : marca ? "font-semibold text-text" : "text-text-dim"
                }`}
              >
                {dia}
              </span>
              <span
                className="h-[3px] w-[3px] rounded-full"
                style={{ background: marca ? (marca.atrasado ? "var(--danger)" : marca.cor) : "transparent" }}
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

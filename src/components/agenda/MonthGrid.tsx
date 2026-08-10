import Link from "next/link";
import { diasNoMes, primeiroDiaSemana, toISODate, hojeParts, isAtrasado } from "@/lib/date";
import type { EventoComCor } from "@/lib/data";

const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MAX_TRACINHOS = 4;

export function MonthGrid({
  ano,
  mes,
  eventosPorDia,
}: {
  ano: number;
  mes: number;
  eventosPorDia: Map<number, EventoComCor[]>;
}) {
  const hoje = hojeParts();
  const total = diasNoMes(ano, mes);
  const offset = primeiroDiaSemana(ano, mes);
  const celulas = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  return (
    <div>
      <div className="grid grid-cols-7 px-3 py-1 text-center text-[10.5px] uppercase tracking-wide text-text-dim">
        {SEMANA.map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 px-3 pb-3">
        {celulas.map((dia, i) => {
          if (dia === null) return <div key={i} className="min-h-[72px]" />;

          const dataISO = toISODate(ano, mes, dia);
          const itens = eventosPorDia.get(dia) ?? [];
          const isHoje = ano === hoje.ano && mes === hoje.mes && dia === hoje.dia;
          const temAtrasado = itens.some((ev) => isAtrasado(dataISO, ev.status));
          const excedente = itens.length - (MAX_TRACINHOS - 1);
          const visiveis = excedente > 0 ? itens.slice(0, MAX_TRACINHOS - 1) : itens;

          return (
            <Link
              key={i}
              href={`/agenda/dia/${dataISO}`}
              className="flex min-h-[72px] flex-col items-center gap-1 border-t border-grid-line px-1 pt-1.5 text-center"
            >
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[13px] ${
                  isHoje ? "bg-today font-bold text-white" : ""
                } ${temAtrasado && !isHoje ? "font-bold shadow-[0_0_0_1.5px_var(--danger)]" : ""}`}
              >
                {dia}
              </span>
              <div className="flex w-[84%] flex-col items-stretch gap-[1.5px]">
                {visiveis.map((item) => (
                  <span key={item.id} className="h-[3px] w-full shrink-0 rounded-sm" style={{ background: item.cor }} />
                ))}
                {excedente > 0 && (
                  <span className="text-[9px] font-bold leading-tight text-text-dim">+{excedente}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

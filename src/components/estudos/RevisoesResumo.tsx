import { isAtrasado } from "@/lib/date";
import type { RevisaoResumo } from "@/lib/data";

function formatarCurta(dataISO: string) {
  const [, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}`;
}

export function RevisoesResumo({ revisoes }: { revisoes: RevisaoResumo[] }) {
  if (revisoes.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {revisoes.map((r) => {
        const atrasada = isAtrasado(r.data, r.status);
        const classe =
          r.status === "feito"
            ? "bg-ok text-white"
            : atrasada
              ? "bg-danger text-white"
              : "bg-surface-2 text-text-dim";
        return (
          <span
            key={r.id}
            className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums ${classe}`}
            title={r.status === "feito" ? "Feita" : atrasada ? "Atrasada" : "Pendente"}
          >
            {formatarCurta(r.data)}
          </span>
        );
      })}
    </div>
  );
}

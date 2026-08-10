import Link from "next/link";

export function VistaSwitcher({ ativa, ano, mes }: { ativa: "mes" | "ano"; ano: number; mes: number }) {
  const base = "rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold";

  return (
    <div className="inline-flex gap-0.5 rounded-lg border border-border bg-surface-2 p-[3px]">
      <Link
        href={`/agenda?ano=${ano}&mes=${mes}`}
        className={`${base} ${ativa === "mes" ? "bg-surface text-text shadow-sm" : "text-text-dim"}`}
      >
        Mês
      </Link>
      <Link
        href={`/agenda/ano?ano=${ano}`}
        className={`${base} ${ativa === "ano" ? "bg-surface text-text shadow-sm" : "text-text-dim"}`}
      >
        Ano
      </Link>
    </div>
  );
}

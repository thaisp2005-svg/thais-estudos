"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { nomeMes, hojeParts } from "@/lib/date";

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/**
 * Título clicável da agenda. Abre um painel com a lista de anos (rolável)
 * e a grade de meses. Em `modo="ano"` o título mostra só o ano e escolher
 * um mês leva para a visão mensal.
 */
export function SeletorMesAno({ ano, mes, modo }: { ano: number; mes?: number; modo: "mes" | "ano" }) {
  const [aberto, setAberto] = useState(false);
  const [anoFoco, setAnoFoco] = useState(ano);
  const router = useRouter();
  const listaAnos = useRef<HTMLDivElement>(null);
  const hoje = hojeParts();

  // 21 anos ao redor do que está sendo exibido — a lista rola
  const anos = Array.from({ length: 21 }, (_, i) => ano - 10 + i);

  useEffect(() => {
    if (!aberto) return;
    listaAnos.current?.querySelector('[data-selecionado="true"]')?.scrollIntoView({ block: "center" });
  }, [aberto]);

  function irParaMes(destinoAno: number, destinoMes: number) {
    setAberto(false);
    router.push(`/agenda?ano=${destinoAno}&mes=${destinoMes}`);
  }

  function irParaAno(destinoAno: number) {
    setAberto(false);
    router.push(`/agenda/ano?ano=${destinoAno}`);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setAnoFoco(ano);
          setAberto((v) => !v);
        }}
        aria-expanded={aberto}
        className="flex items-baseline gap-2 rounded-lg px-1.5 py-1 hover:bg-surface-2"
      >
        {modo === "mes" && <span className="text-[28px] font-extrabold capitalize">{nomeMes(mes ?? hoje.mes)}</span>}
        <span className={modo === "ano" ? "text-[28px] font-extrabold" : "text-xs font-semibold text-text-dim"}>
          {ano}
        </span>
        <span className="text-xs text-text-dim" aria-hidden>
          ▾
        </span>
      </button>

      {aberto && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setAberto(false)} aria-hidden />
          <div className="absolute left-0 top-full z-40 mt-1 flex w-[300px] gap-3 rounded-xl border border-border bg-surface p-3 shadow-xl">
            <div
              ref={listaAnos}
              className="h-[212px] w-[86px] shrink-0 overflow-y-auto rounded-lg bg-surface-2 p-1"
            >
              {anos.map((a) => (
                <button
                  key={a}
                  type="button"
                  data-selecionado={a === anoFoco}
                  onClick={() => setAnoFoco(a)}
                  className={`block w-full rounded-md px-2 py-1.5 text-left text-[13px] font-semibold ${
                    a === anoFoco ? "bg-accent text-accent-text" : "text-text-dim hover:bg-surface"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-3 gap-1.5">
                {MESES_CURTOS.map((m, i) => {
                  const numeroMes = i + 1;
                  const atual = modo === "mes" && anoFoco === ano && numeroMes === mes;
                  const ehHoje = anoFoco === hoje.ano && numeroMes === hoje.mes;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => irParaMes(anoFoco, numeroMes)}
                      className={`rounded-md py-2 text-[12.5px] font-semibold capitalize ${
                        atual
                          ? "bg-accent text-accent-text"
                          : ehHoje
                            ? "text-today ring-1 ring-today"
                            : "text-text-dim hover:bg-surface-2"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => irParaAno(anoFoco)}
                className="mt-2 w-full rounded-md border border-border py-1.5 text-[12px] font-semibold text-text-dim hover:bg-surface-2"
              >
                Ver o ano de {anoFoco}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import Link from "next/link";
import { getPlanosRevisao, getTema } from "@/lib/data";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { rotuloIntervalo } from "@/lib/date";

export default async function ConfiguracoesPage() {
  const [planos, tema] = await Promise.all([getPlanosRevisao(), getTema()]);

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <h1 className="mb-5 text-lg font-bold">Configurações</h1>

      <section className="mb-8">
        <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-text-dim">Aparência</h2>
        <ThemeToggle temaInicial={tema} />
        <p className="mt-2 text-[11.5px] text-text-dim">
          Essa escolha é salva e vale em qualquer aparelho onde você abrir o app.
        </p>
      </section>

      <section>
        <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-text-dim">Planos de revisão</h2>
        <div className="flex flex-col gap-2">
          {planos.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3 py-3">
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-bold">{p.nome}</div>
                <div className="mt-0.5 text-[11.5px] text-text-dim">
                  {p.intervalos_dias.map(rotuloIntervalo).join(" · ")}
                </div>
              </div>
              {p.is_padrao ? (
                <span className="shrink-0 rounded-full border border-accent px-2 py-0.5 text-[10px] font-bold text-accent">
                  padrão
                </span>
              ) : (
                <Link
                  href={`/configuracoes/planos/${p.id}`}
                  className="shrink-0 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[11.5px] font-bold text-text-dim"
                >
                  Editar
                </Link>
              )}
            </div>
          ))}
          <Link
            href="/configuracoes/planos/novo"
            className="mt-1 rounded-xl border-[1.5px] border-dashed border-border py-3 text-center text-[13px] font-semibold text-text-dim"
          >
            + Criar novo plano
          </Link>
        </div>
        <p className="mt-3 text-[11.5px] text-text-dim">
          Os planos padrão (A e B) não podem ser alterados. Crie os seus para usar intervalos diferentes.
        </p>
      </section>
    </div>
  );
}

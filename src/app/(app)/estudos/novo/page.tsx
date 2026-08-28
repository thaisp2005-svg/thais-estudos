import Link from "next/link";
import { ConteudoForm } from "@/components/estudos/ConteudoForm";
import { getPlanosRevisao, getMaterias } from "@/lib/data";

export default async function NovoConteudoPage() {
  const [planos, materias] = await Promise.all([getPlanosRevisao(), getMaterias()]);

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href="/estudos" className="text-sm font-semibold text-accent">
        ‹ Estudos
      </Link>
      <h1 className="mt-2 text-lg font-bold">Novo conteúdo de estudo</h1>
      <p className="mb-5 mt-1 text-xs text-text-dim">
        As revisões são geradas automaticamente a partir do plano escolhido.
      </p>
      <ConteudoForm planos={planos} materias={materias} />
    </div>
  );
}

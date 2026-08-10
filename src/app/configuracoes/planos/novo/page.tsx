import Link from "next/link";
import { PlanoForm } from "@/components/configuracoes/PlanoForm";

export default function NovoPlanoPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href="/configuracoes" className="text-sm font-semibold text-accent">
        ‹ Configurações
      </Link>
      <h1 className="mt-2 text-lg font-bold">Novo plano de revisão</h1>
      <p className="mb-5 mt-1 text-xs text-text-dim">
        Defina quantas revisões o plano terá e em quantos dias cada uma cai.
      </p>
      <PlanoForm />
    </div>
  );
}

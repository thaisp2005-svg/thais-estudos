import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlanosRevisao } from "@/lib/data";
import { PlanoForm } from "@/components/configuracoes/PlanoForm";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { deletePlanoAction } from "@/lib/actions";

export default async function EditarPlanoPage({ params }: PageProps<"/configuracoes/planos/[id]">) {
  const { id } = await params;
  const plano = (await getPlanosRevisao()).find((p) => p.id === id);
  if (!plano || plano.is_padrao) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href="/configuracoes" className="text-sm font-semibold text-accent">
        ‹ Configurações
      </Link>
      <h1 className="mb-5 mt-2 text-lg font-bold">Editar plano</h1>

      <PlanoForm inicial={{ id: plano.id, nome: plano.nome, intervalos_dias: plano.intervalos_dias }} />

      <form action={deletePlanoAction} className="mt-8 border-t border-border pt-5">
        <input type="hidden" name="id" value={plano.id} />
        <DeleteButton mensagem={`Excluir o plano "${plano.nome}"?`}>Excluir plano</DeleteButton>
        <p className="mt-2 text-[11.5px] text-text-dim">
          Só é possível excluir planos que não estejam em uso por nenhum conteúdo.
        </p>
      </form>
    </div>
  );
}

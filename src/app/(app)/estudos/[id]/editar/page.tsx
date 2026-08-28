import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getConteudoDetalhe, getPlanosRevisao, getMaterias } from "@/lib/data";
import { ConteudoForm } from "@/components/estudos/ConteudoForm";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { deleteConteudoAction } from "@/lib/actions";

export default async function EditarConteudoPage({ params }: PageProps<"/estudos/[id]/editar">) {
  const { id } = await params;
  const [resultado, planos, materias] = await Promise.all([
    getConteudoDetalhe(id),
    getPlanosRevisao(),
    getMaterias(),
  ]);
  if (!resultado) notFound();
  const { conteudo } = resultado;

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href={`/estudos/${id}`} className="text-sm font-semibold text-accent">
        ‹ Voltar para o conteúdo
      </Link>
      <h1 className="mb-5 mt-2 text-lg font-bold">Editar conteúdo</h1>

      <Suspense fallback={null}>
        <ConteudoForm
          planos={planos}
          materias={materias}
          inicial={{
            id: conteudo.id,
            titulo: conteudo.titulo,
            materia_id: conteudo.materia_id ?? "",
            observacoes: conteudo.observacoes,
            data_inicial: conteudo.data_inicial,
            plano_revisao_id: conteudo.plano_revisao_id,
          }}
        />
      </Suspense>

      <form action={deleteConteudoAction} className="mt-8 border-t border-border pt-5">
        <input type="hidden" name="id" value={conteudo.id} />
        <DeleteButton mensagem={`Excluir "${conteudo.titulo}" e todas as suas revisões?`}>
          Excluir conteúdo
        </DeleteButton>
        <p className="mt-2 text-[11.5px] text-text-dim">
          As revisões deste conteúdo saem da agenda junto.
        </p>
      </form>
    </div>
  );
}

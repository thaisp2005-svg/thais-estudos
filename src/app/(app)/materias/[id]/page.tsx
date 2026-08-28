import Link from "next/link";
import { notFound } from "next/navigation";
import { getMateriaById } from "@/lib/data";
import { MateriaForm } from "@/components/materias/MateriaForm";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { deleteMateriaAction } from "@/lib/actions";

export default async function EditarMateriaPage({ params }: PageProps<"/materias/[id]">) {
  const { id } = await params;
  const materia = await getMateriaById(id);
  if (!materia) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href="/materias" className="text-sm font-semibold text-accent">
        ‹ Matérias
      </Link>
      <h1 className="mb-5 mt-2 text-lg font-bold">Editar matéria</h1>

      <MateriaForm inicial={materia} />

      <form action={deleteMateriaAction} className="mt-8 border-t border-border pt-5">
        <input type="hidden" name="id" value={materia.id} />
        <DeleteButton mensagem={`Excluir a matéria "${materia.nome}"?`}>Excluir matéria</DeleteButton>
        <p className="mt-2 text-[11.5px] text-text-dim">
          Só é possível excluir matérias que não estejam em uso por nenhum conteúdo de estudo.
        </p>
      </form>
    </div>
  );
}

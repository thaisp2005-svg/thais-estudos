import Link from "next/link";
import { MateriaForm } from "@/components/materias/MateriaForm";

export default async function NovaMateriaPage({ searchParams }: PageProps<"/materias/novo">) {
  const { voltar_para } = await searchParams;
  const voltarPara = typeof voltar_para === "string" ? voltar_para : undefined;

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href={voltarPara ?? "/materias"} className="text-sm font-semibold text-accent">
        ‹ {voltarPara ? "Voltar" : "Matérias"}
      </Link>
      <h1 className="mb-5 mt-2 text-lg font-bold">Nova matéria</h1>
      <MateriaForm voltarPara={voltarPara} />
    </div>
  );
}

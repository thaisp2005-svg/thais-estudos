import Link from "next/link";
import { MateriaForm } from "@/components/materias/MateriaForm";

export default function NovaMateriaPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href="/materias" className="text-sm font-semibold text-accent">
        ‹ Matérias
      </Link>
      <h1 className="mb-5 mt-2 text-lg font-bold">Nova matéria</h1>
      <MateriaForm />
    </div>
  );
}

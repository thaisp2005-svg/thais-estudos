import Link from "next/link";
import { EventoForm } from "@/components/agenda/EventoForm";
import { hojeISO } from "@/lib/date";

export default async function NovoCompromissoPage({ searchParams }: PageProps<"/agenda/novo">) {
  const { data } = await searchParams;
  const dataInicial = typeof data === "string" ? data : hojeISO();

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href="/agenda" className="text-sm font-semibold text-accent">
        ‹ Agenda
      </Link>
      <h1 className="mt-2 text-lg font-bold">Novo compromisso</h1>
      <p className="mb-5 mt-1 text-xs text-text-dim">
        Tarefas e compromissos avulsos aparecem na agenda junto com as revisões de estudo.
      </p>
      <EventoForm data={dataInicial} />
    </div>
  );
}

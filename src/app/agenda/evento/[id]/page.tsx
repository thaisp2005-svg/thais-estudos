import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEvento } from "@/lib/data";
import { EventoForm } from "@/components/agenda/EventoForm";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { deleteEventoAction } from "@/lib/actions";

export default async function EditarEventoPage({ params }: PageProps<"/agenda/evento/[id]">) {
  const { id } = await params;
  const evento = await getEvento(id);
  if (!evento) notFound();

  // revisões pertencem a um conteúdo de estudo e são editadas por lá
  if (evento.tipo === "revisao") redirect(`/estudos/${evento.conteudo_id}`);

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-8 md:py-10">
      <Link href={`/agenda/dia/${evento.data}`} className="text-sm font-semibold text-accent">
        ‹ Voltar para o dia
      </Link>
      <h1 className="mb-5 mt-2 text-lg font-bold">Editar {evento.tipo}</h1>

      <EventoForm
        data={evento.data}
        inicial={{
          id: evento.id,
          tipo: evento.tipo as "tarefa" | "compromisso",
          titulo: evento.titulo,
          data: evento.data,
          observacoes: evento.observacoes,
          horario_inicio: evento.horario_inicio,
          horario_fim: evento.horario_fim,
        }}
      />

      <form action={deleteEventoAction} className="mt-8 border-t border-border pt-5">
        <input type="hidden" name="id" value={evento.id} />
        <input type="hidden" name="voltar_para" value={`/agenda/dia/${evento.data}`} />
        <DeleteButton mensagem={`Excluir "${evento.titulo}"?`}>Excluir</DeleteButton>
      </form>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { hojeISO, toISODate, diasNoMes, isAtrasado } from "@/lib/date";
import { COR_AVULSO } from "@/lib/palette";
import type { Tema } from "@/lib/supabase/types";

export type EventoComCor = {
  id: string;
  tipo: "revisao" | "tarefa" | "compromisso";
  titulo: string;
  data: string;
  status: "pendente" | "feito";
  conteudo_id: string | null;
  horario_inicio: string | null;
  horario_fim: string | null;
  materia: string | null;
  cor: string;
};

type EventoRow = {
  id: string;
  tipo: "revisao" | "tarefa" | "compromisso";
  titulo: string;
  data: string;
  status: "pendente" | "feito";
  conteudo_id: string | null;
  horario_inicio: string | null;
  horario_fim: string | null;
  conteudos_estudo: { materias: { nome: string; cor: string } | null } | null;
};

const SELECT_EVENTO =
  "id, tipo, titulo, data, status, conteudo_id, horario_inicio, horario_fim, conteudos_estudo(materias(nome, cor))";

function comCor(row: EventoRow): EventoComCor {
  const materia = row.conteudos_estudo?.materias ?? null;
  return {
    id: row.id,
    tipo: row.tipo,
    titulo: row.titulo,
    data: row.data,
    status: row.status,
    conteudo_id: row.conteudo_id,
    horario_inicio: row.horario_inicio,
    horario_fim: row.horario_fim,
    materia: materia?.nome ?? null,
    cor: materia?.cor ?? COR_AVULSO,
  };
}

/**
 * Faz o erro do banco aparecer em vez de virar uma lista vazia silenciosa —
 * normalmente indica migration não aplicada ou policy faltando.
 */
function ok<T>({ data, error }: { data: T | null; error: { message: string } | null }, contexto: string): T | null {
  if (error) throw new Error(`${contexto}: ${error.message}`);
  return data;
}

export type MateriaResumo = { id: string; nome: string; cor: string };

export async function getMaterias(): Promise<MateriaResumo[]> {
  const supabase = await createClient();
  const res = await supabase.from("materias").select("id, nome, cor").order("nome");
  return ok(res, "Falha ao carregar matérias") ?? [];
}

export async function getMateriaById(id: string) {
  const supabase = await createClient();
  const res = await supabase.from("materias").select("id, nome, cor").eq("id", id).maybeSingle();
  return ok(res, "Falha ao carregar matéria");
}

/** Só as matérias que têm pelo menos um conteúdo de estudo — para a legenda ligada ao calendário. */
export async function getMateriasEmUso(): Promise<MateriaResumo[]> {
  const supabase = await createClient();
  const res = await supabase
    .from("conteudos_estudo")
    .select("materias(id, nome, cor)")
    .not("materia_id", "is", null);

  const data = ok(res, "Falha ao carregar matérias em uso") ?? [];
  const vistas = new Map<string, MateriaResumo>();
  for (const row of data as unknown as { materias: MateriaResumo | null }[]) {
    if (row.materias) vistas.set(row.materias.id, row.materias);
  }
  return [...vistas.values()].sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function getPlanosRevisao() {
  const supabase = await createClient();
  const res = await supabase
    .from("planos_revisao")
    .select("id, nome, intervalos_dias, is_padrao")
    .order("is_padrao", { ascending: false })
    .order("nome");
  return ok(res, "Falha ao carregar planos de revisão") ?? [];
}

export type RevisaoResumo = { id: string; data: string; status: "pendente" | "feito" };

export async function getConteudos() {
  const supabase = await createClient();
  const res = await supabase
    .from("conteudos_estudo")
    .select("id, titulo, data_inicial, materias(nome, cor), planos_revisao(nome), eventos(id, data, status)")
    .order("created_at", { ascending: false });

  const data = ok(res, "Falha ao carregar conteúdos");
  const conteudos = (data ?? []) as unknown as {
    id: string;
    titulo: string;
    data_inicial: string;
    materias: { nome: string; cor: string } | null;
    planos_revisao: { nome: string } | null;
    eventos: RevisaoResumo[];
  }[];

  // as revisões vêm em qualquer ordem — organiza por data
  for (const c of conteudos) c.eventos.sort((a, b) => a.data.localeCompare(b.data));
  return conteudos;
}

export type ConteudoDetalhe = {
  id: string;
  titulo: string;
  observacoes: string | null;
  data_inicial: string;
  materia_id: string | null;
  plano_revisao_id: string | null;
  materias: { nome: string; cor: string } | null;
  planos_revisao: { nome: string } | null;
};

export async function getConteudoDetalhe(id: string) {
  const supabase = await createClient();
  const { data: conteudo } = await supabase
    .from("conteudos_estudo")
    .select(
      "id, titulo, observacoes, data_inicial, materia_id, plano_revisao_id, materias(nome, cor), planos_revisao(nome)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!conteudo) return null;

  const { data: eventos } = await supabase
    .from("eventos")
    .select("id, titulo, data, status, numero_revisao")
    .eq("conteudo_id", id)
    .order("data");

  return { conteudo: conteudo as unknown as ConteudoDetalhe, eventos: eventos ?? [] };
}

export async function getEvento(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos")
    .select("id, tipo, titulo, data, status, observacoes, conteudo_id, horario_inicio, horario_fim")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getEventosDoMes(ano: number, mes: number) {
  const supabase = await createClient();
  const inicio = toISODate(ano, mes, 1);
  const fim = toISODate(ano, mes, diasNoMes(ano, mes));

  const { data } = await supabase.from("eventos").select(SELECT_EVENTO).gte("data", inicio).lte("data", fim);

  const porDia = new Map<number, EventoComCor[]>();
  for (const row of (data ?? []) as unknown as EventoRow[]) {
    const dia = Number(row.data.slice(8, 10));
    const lista = porDia.get(dia) ?? [];
    lista.push(comCor(row));
    porDia.set(dia, lista);
  }
  return porDia;
}

export async function getEventosDoDia(dataISO: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("eventos").select(SELECT_EVENTO).eq("data", dataISO).order("tipo");
  return ((data ?? []) as unknown as EventoRow[]).map(comCor);
}

/** Um marcador por dia do ano, para a visão anual (12 meses de uma vez). */
export type MarcaDia = { cor: string; atrasado: boolean };

export async function getMarcasDoAno(ano: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos")
    .select(SELECT_EVENTO)
    .gte("data", `${ano}-01-01`)
    .lte("data", `${ano}-12-31`);

  const porData = new Map<string, MarcaDia>();
  for (const row of (data ?? []) as unknown as EventoRow[]) {
    const ev = comCor(row);
    const atrasado = isAtrasado(ev.data, ev.status);
    const atual = porData.get(ev.data);
    // guarda a cor do primeiro evento do dia e marca o dia se qualquer um estiver atrasado
    porData.set(ev.data, atual ? { cor: atual.cor, atrasado: atual.atrasado || atrasado } : { cor: ev.cor, atrasado });
  }
  return porData;
}

export async function getPainel() {
  const supabase = await createClient();
  const hoje = hojeISO();

  const [{ data: atrasadosRaw }, { data: hojeRaw }] = await Promise.all([
    supabase.from("eventos").select(SELECT_EVENTO).eq("status", "pendente").lt("data", hoje).order("data"),
    supabase.from("eventos").select(SELECT_EVENTO).eq("data", hoje),
  ]);

  return {
    atrasados: ((atrasadosRaw ?? []) as unknown as EventoRow[]).map(comCor),
    hoje: ((hojeRaw ?? []) as unknown as EventoRow[]).map(comCor),
  };
}

export async function getTema(): Promise<Tema> {
  const supabase = await createClient();
  const { data } = await supabase.from("preferencias").select("tema").eq("id", true).maybeSingle();
  return data?.tema ?? "auto";
}

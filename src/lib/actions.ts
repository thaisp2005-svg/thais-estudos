"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { somarDias, rotuloIntervalo, gerarOcorrencias, type Repeticao } from "@/lib/date";
import type { Tema } from "@/lib/supabase/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;

function tituloRevisao(tituloConteudo: string, dias: number) {
  return `${tituloConteudo} · Revisão (${rotuloIntervalo(dias)})`;
}

function tituloAvulsa(tituloConteudo: string) {
  return `${tituloConteudo} · Revisão avulsa`;
}

async function getIntervalos(supabase: Supabase, planoId: string) {
  const { data: plano } = await supabase
    .from("planos_revisao")
    .select("intervalos_dias")
    .eq("id", planoId)
    .single();
  if (!plano) throw new Error("Plano de revisão não encontrado.");
  return plano.intervalos_dias as number[];
}

/**
 * Regera as revisões pendentes de um conteúdo a partir do plano/data atuais.
 * Revisões já marcadas como feitas são preservadas (só têm o título atualizado),
 * e revisões avulsas nunca são tocadas.
 */
async function regenerarRevisoes(
  supabase: Supabase,
  conteudoId: string,
  titulo: string,
  dataInicial: string,
  intervalos: number[]
) {
  const { data: existentes } = await supabase
    .from("eventos")
    .select("id, numero_revisao, status")
    .eq("conteudo_id", conteudoId)
    .not("numero_revisao", "is", null);

  const feitas = (existentes ?? []).filter((e) => e.status === "feito");
  const numerosFeitos = new Set(feitas.map((e) => e.numero_revisao));

  // apaga as pendentes geradas pelo plano (mantém feitas e avulsas)
  await supabase
    .from("eventos")
    .delete()
    .eq("conteudo_id", conteudoId)
    .eq("status", "pendente")
    .not("numero_revisao", "is", null);

  const novas = intervalos
    .map((dias, i) => ({
      tipo: "revisao" as const,
      titulo: tituloRevisao(titulo, dias),
      data: somarDias(dataInicial, dias),
      status: "pendente" as const,
      conteudo_id: conteudoId,
      numero_revisao: i + 1,
    }))
    .filter((ev) => !numerosFeitos.has(ev.numero_revisao));

  if (novas.length) {
    const { error } = await supabase.from("eventos").insert(novas);
    if (error) throw new Error(error.message);
  }

  // mantém o título das já feitas coerente com o conteúdo/plano atuais
  for (const feita of feitas) {
    const dias = intervalos[(feita.numero_revisao as number) - 1];
    if (dias === undefined) continue;
    await supabase.from("eventos").update({ titulo: tituloRevisao(titulo, dias) }).eq("id", feita.id);
  }

  await supabase
    .from("eventos")
    .update({ titulo: tituloAvulsa(titulo) })
    .eq("conteudo_id", conteudoId)
    .is("numero_revisao", null);
}

// ---------------------------------------------------------------- conteúdos

export async function createConteudoAction(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const materiaId = String(formData.get("materia_id") ?? "");
  const dataInicial = String(formData.get("data_inicial") ?? "");
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;
  const planoId = String(formData.get("plano_revisao_id") ?? "");

  if (!titulo || !materiaId || !dataInicial || !planoId) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const supabase = await createClient();
  const intervalos = await getIntervalos(supabase, planoId);

  const { data: conteudo, error } = await supabase
    .from("conteudos_estudo")
    .insert({
      titulo,
      materia_id: materiaId,
      observacoes,
      data_inicial: dataInicial,
      plano_revisao_id: planoId,
    })
    .select("id")
    .single();
  if (error || !conteudo) throw new Error(error?.message ?? "Não foi possível criar o conteúdo.");

  await regenerarRevisoes(supabase, conteudo.id, titulo, dataInicial, intervalos);

  revalidatePath("/", "layout");
  redirect(`/estudos/${conteudo.id}`);
}

export async function updateConteudoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const materiaId = String(formData.get("materia_id") ?? "");
  const dataInicial = String(formData.get("data_inicial") ?? "");
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;
  const planoId = String(formData.get("plano_revisao_id") ?? "");

  if (!id || !titulo || !materiaId || !dataInicial || !planoId) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const supabase = await createClient();
  const intervalos = await getIntervalos(supabase, planoId);

  const { error } = await supabase
    .from("conteudos_estudo")
    .update({
      titulo,
      materia_id: materiaId,
      observacoes,
      data_inicial: dataInicial,
      plano_revisao_id: planoId,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await regenerarRevisoes(supabase, id, titulo, dataInicial, intervalos);

  revalidatePath("/", "layout");
  redirect(`/estudos/${id}`);
}

export async function deleteConteudoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Conteúdo não informado.");

  const supabase = await createClient();
  // as revisões saem junto por causa do ON DELETE CASCADE em eventos.conteudo_id
  const { error } = await supabase.from("conteudos_estudo").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/estudos");
}

export async function createRevisaoAvulsaAction(formData: FormData) {
  const conteudoId = String(formData.get("conteudo_id") ?? "");
  const data = String(formData.get("data") ?? "");
  if (!conteudoId || !data) throw new Error("Informe a data da revisão.");

  const supabase = await createClient();
  const { data: conteudo } = await supabase
    .from("conteudos_estudo")
    .select("titulo")
    .eq("id", conteudoId)
    .single();
  if (!conteudo) throw new Error("Conteúdo não encontrado.");

  const { error } = await supabase.from("eventos").insert({
    tipo: "revisao",
    titulo: tituloAvulsa(conteudo.titulo),
    data,
    status: "pendente",
    conteudo_id: conteudoId,
    numero_revisao: null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect(`/estudos/${conteudoId}`);
}

export async function deleteRevisaoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Revisão não informada.");

  const supabase = await createClient();
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------- eventos

export async function createCompromissoAction(formData: FormData) {
  const tipo = String(formData.get("tipo") ?? "tarefa");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const data = String(formData.get("data") ?? "");
  const horarioInicio = String(formData.get("horario_inicio") ?? "").trim() || null;
  const horarioFim = String(formData.get("horario_fim") ?? "").trim() || null;
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;
  const repete = (String(formData.get("repete") ?? "nunca") || "nunca") as Repeticao;
  const intervaloPersonalizado = Number(formData.get("intervalo_personalizado") ?? 0) || undefined;

  if (!titulo || !data || (tipo !== "tarefa" && tipo !== "compromisso")) {
    throw new Error("Preencha os campos obrigatórios.");
  }

  const supabase = await createClient();
  const datas = gerarOcorrencias(data, repete, intervaloPersonalizado);
  const linhas = datas.map((d) => ({
    tipo,
    titulo,
    data: d,
    status: "pendente" as const,
    observacoes,
    horario_inicio: horarioInicio,
    horario_fim: horarioFim,
  }));

  const { error } = await supabase.from("eventos").insert(linhas);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect(`/agenda/dia/${data}`);
}

export async function updateEventoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const tipo = String(formData.get("tipo") ?? "tarefa");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const data = String(formData.get("data") ?? "");
  const horarioInicio = String(formData.get("horario_inicio") ?? "").trim() || null;
  const horarioFim = String(formData.get("horario_fim") ?? "").trim() || null;
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;

  if (!id || !titulo || !data || (tipo !== "tarefa" && tipo !== "compromisso")) {
    throw new Error("Preencha os campos obrigatórios.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("eventos")
    .update({ tipo, titulo, data, observacoes, horario_inicio: horarioInicio, horario_fim: horarioFim })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect(`/agenda/dia/${data}`);
}

export async function deleteEventoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const voltarPara = String(formData.get("voltar_para") ?? "/agenda");
  if (!id) throw new Error("Evento não informado.");

  const supabase = await createClient();
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect(voltarPara);
}

export async function toggleEventoAction(id: string, feito: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("eventos")
    .update({ status: feito ? "feito" : "pendente", concluido_em: feito ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------- planos

function parseIntervalos(formData: FormData) {
  const bruto = formData.getAll("intervalo").map((v) => Number(String(v).trim()));
  const intervalos = bruto.filter((n) => Number.isInteger(n) && n > 0);
  if (intervalos.length === 0) throw new Error("Informe ao menos um intervalo em dias.");
  return [...new Set(intervalos)].sort((a, b) => a - b);
}

export async function createPlanoAction(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) throw new Error("Dê um nome ao plano.");
  const intervalos = parseIntervalos(formData);

  const supabase = await createClient();
  const { error } = await supabase.from("planos_revisao").insert({ nome, intervalos_dias: intervalos });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/configuracoes");
}

export async function updatePlanoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  if (!id || !nome) throw new Error("Dê um nome ao plano.");
  const intervalos = parseIntervalos(formData);

  const supabase = await createClient();
  const { error } = await supabase
    .from("planos_revisao")
    .update({ nome, intervalos_dias: intervalos })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/configuracoes");
}

export async function deletePlanoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Plano não informado.");

  const supabase = await createClient();
  const { count } = await supabase
    .from("conteudos_estudo")
    .select("id", { count: "exact", head: true })
    .eq("plano_revisao_id", id);

  if ((count ?? 0) > 0) {
    throw new Error(
      `Este plano está em uso por ${count} conteúdo(s). Troque o plano deles antes de excluir.`
    );
  }

  const { error } = await supabase.from("planos_revisao").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/configuracoes");
}

// ---------------------------------------------------------------- matérias

export async function createMateriaAction(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const cor = String(formData.get("cor") ?? "").trim();
  const voltarPara = String(formData.get("voltar_para") ?? "").trim() || null;
  if (!nome || !cor) throw new Error("Preencha nome e cor.");

  const supabase = await createClient();
  const { data: existente } = await supabase.from("materias").select("id").ilike("nome", nome).maybeSingle();
  if (existente) throw new Error("Já existe uma matéria com esse nome.");

  const { data: nova, error } = await supabase.from("materias").insert({ nome, cor }).select("id").single();
  if (error || !nova) throw new Error(error?.message ?? "Não foi possível criar a matéria.");

  revalidatePath("/", "layout");
  // veio do "+ Nova matéria" de dentro de um formulário de conteúdo — volta pra lá,
  // já com a matéria recém-criada selecionada
  redirect(voltarPara ? `${voltarPara}?materia=${nova.id}` : "/materias");
}

export async function updateMateriaAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const cor = String(formData.get("cor") ?? "").trim();
  if (!id || !nome || !cor) throw new Error("Preencha nome e cor.");

  const supabase = await createClient();
  const { error } = await supabase.from("materias").update({ nome, cor }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/materias");
}

export async function deleteMateriaAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Matéria não informada.");

  const supabase = await createClient();
  const { count } = await supabase
    .from("conteudos_estudo")
    .select("id", { count: "exact", head: true })
    .eq("materia_id", id);

  if ((count ?? 0) > 0) {
    throw new Error(`Esta matéria está em uso por ${count} conteúdo(s). Troque a matéria deles antes de excluir.`);
  }

  const { error } = await supabase.from("materias").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/materias");
}

// ---------------------------------------------------------------- preferências

export async function setTemaAction(tema: Tema) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("preferencias")
    .upsert({ id: true, tema, atualizado_em: new Date().toISOString() });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

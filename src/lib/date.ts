export function toISODate(ano: number, mes: number, dia: number) {
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/** data local (não UTC) de hoje, para não pular de dia perto da meia-noite */
export function hojeParts() {
  const d = new Date();
  return { ano: d.getFullYear(), mes: d.getMonth() + 1, dia: d.getDate() };
}

export function hojeISO() {
  const { ano, mes, dia } = hojeParts();
  return toISODate(ano, mes, dia);
}

/** soma dias a uma data 'YYYY-MM-DD' e devolve outra 'YYYY-MM-DD' (em UTC, sem hora) */
export function somarDias(dataISO: string, dias: number) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  d.setUTCDate(d.getUTCDate() + dias);
  return toISODate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function rotuloIntervalo(dias: number) {
  return dias === 1 ? "24h" : `${dias} dias`;
}

export function isAtrasado(dataISO: string, status: "pendente" | "feito") {
  return status === "pendente" && dataISO < hojeISO();
}

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const DIAS_SEMANA = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];

export function nomeMes(mes: number) {
  return MESES[mes - 1];
}

export function diasNoMes(ano: number, mes: number) {
  return new Date(ano, mes, 0).getDate();
}

export function primeiroDiaSemana(ano: number, mes: number) {
  return new Date(ano, mes - 1, 1).getDay();
}

export function tituloDiaLongo(ano: number, mes: number, dia: number) {
  const diaSemana = DIAS_SEMANA[new Date(ano, mes - 1, dia).getDay()];
  return `${diaSemana} — ${dia} de ${nomeMes(mes).slice(0, 3)}. de ${ano}`;
}

export function mesAnterior(ano: number, mes: number) {
  return mes === 1 ? { ano: ano - 1, mes: 12 } : { ano, mes: mes - 1 };
}

export function mesSeguinte(ano: number, mes: number) {
  return mes === 12 ? { ano: ano + 1, mes: 1 } : { ano, mes: mes + 1 };
}

/** lê ano/mes de searchParams, caindo no mês atual quando ausentes ou inválidos */
export function mesDeParams(params: { ano?: string | string[]; mes?: string | string[] }) {
  const hoje = hojeParts();
  const ano = Number(Array.isArray(params.ano) ? params.ano[0] : params.ano);
  const mes = Number(Array.isArray(params.mes) ? params.mes[0] : params.mes);
  const anoOk = Number.isInteger(ano) && ano >= 1970 && ano <= 2999;
  const mesOk = Number.isInteger(mes) && mes >= 1 && mes <= 12;
  return anoOk && mesOk ? { ano, mes } : { ano: hoje.ano, mes: hoje.mes };
}

export type Repeticao = "nunca" | "diario" | "semanal" | "quinzenal" | "mensal" | "anual" | "personalizado";

export const OPCOES_REPETICAO: { valor: Repeticao; rotulo: string }[] = [
  { valor: "nunca", rotulo: "Nunca" },
  { valor: "diario", rotulo: "Todos os dias" },
  { valor: "semanal", rotulo: "Todas as semanas" },
  { valor: "quinzenal", rotulo: "A cada 2 semanas" },
  { valor: "mensal", rotulo: "Todos os meses" },
  { valor: "anual", rotulo: "Todos os anos" },
  { valor: "personalizado", rotulo: "Personalizado" },
];

/**
 * Gera as datas (YYYY-MM-DD) de todas as ocorrências de um evento recorrente,
 * a partir da data inicial. Cada ocorrência vira sua própria linha em `eventos`
 * (mesmo princípio das revisões de estudo) — não existe uma "regra" guardada,
 * então editar/excluir depois mexe só naquela ocorrência.
 * Limitado a 1 ano à frente e 200 ocorrências, por segurança.
 */
export function gerarOcorrencias(dataInicialISO: string, repeticao: Repeticao, intervaloPersonalizadoDias?: number) {
  if (repeticao === "nunca") return [dataInicialISO];

  const [ano, mes, dia] = dataInicialISO.split("-").map(Number);
  const cursor = new Date(Date.UTC(ano, mes - 1, dia));
  const limite = new Date(Date.UTC(ano + 1, mes - 1, dia));
  const MAX_OCORRENCIAS = 200;

  const datas: string[] = [];
  while (cursor <= limite && datas.length < MAX_OCORRENCIAS) {
    datas.push(toISODate(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, cursor.getUTCDate()));
    switch (repeticao) {
      case "diario":
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        break;
      case "semanal":
        cursor.setUTCDate(cursor.getUTCDate() + 7);
        break;
      case "quinzenal":
        cursor.setUTCDate(cursor.getUTCDate() + 14);
        break;
      case "mensal":
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
        break;
      case "anual":
        cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
        break;
      case "personalizado":
        cursor.setUTCDate(cursor.getUTCDate() + (intervaloPersonalizadoDias && intervaloPersonalizadoDias > 0 ? intervaloPersonalizadoDias : 1));
        break;
    }
  }
  return datas;
}

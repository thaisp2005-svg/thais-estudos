// Paleta fixa oferecida ao cadastrar/editar a cor de uma matéria.
// O usuário também pode escolher uma cor personalizada (hex livre) —
// nesse caso o hex é salvo direto em materias.cor, fora desta lista.
export const EVENT_PALETTE = [
  { nome: "Verde musgo", hex: "#6B7A4A" },
  { nome: "Verde claro", hex: "#8FBF6B" },
  { nome: "Azul marinho", hex: "#24476B" },
  { nome: "Azul claro", hex: "#5AA9E6" },
  { nome: "Laranja", hex: "#F2994A" },
  { nome: "Amarelo", hex: "#F2C94C" },
  { nome: "Vermelho", hex: "#EB5757" },
  { nome: "Rosa choque", hex: "#FF3D9A" },
  { nome: "Roxo", hex: "#9B51E0" },
] as const;

// cor fixa para tarefas/compromissos avulsos (sem matéria vinculada)
export const COR_AVULSO = "#8A8D93";

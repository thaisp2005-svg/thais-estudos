export type PlanoRevisao = {
  id: string;
  user_id: string | null;
  nome: string;
  intervalos_dias: number[];
  is_padrao: boolean;
  created_at: string;
};

export type Materia = {
  id: string;
  user_id: string | null;
  nome: string;
  cor: string;
  created_at: string;
};

export type ConteudoEstudo = {
  id: string;
  user_id: string | null;
  titulo: string;
  materia_id: string | null;
  observacoes: string | null;
  data_inicial: string;
  plano_revisao_id: string | null;
  created_at: string;
};

export type TipoEvento = "revisao" | "tarefa" | "compromisso";
export type StatusEvento = "pendente" | "feito";

export type Evento = {
  id: string;
  user_id: string | null;
  tipo: TipoEvento;
  titulo: string;
  data: string;
  status: StatusEvento;
  conteudo_id: string | null;
  numero_revisao: number | null;
  observacoes: string | null;
  horario_inicio: string | null;
  horario_fim: string | null;
  concluido_em: string | null;
  created_at: string;
};

export type Tema = "light" | "dark" | "auto";

export type Preferencias = {
  id: boolean;
  tema: Tema;
  atualizado_em: string;
};

export type Database = {
  public: {
    Tables: {
      planos_revisao: {
        Row: PlanoRevisao;
        Insert: Partial<PlanoRevisao>;
        Update: Partial<PlanoRevisao>;
        Relationships: [];
      };
      materias: { Row: Materia; Insert: Partial<Materia>; Update: Partial<Materia>; Relationships: [] };
      conteudos_estudo: {
        Row: ConteudoEstudo;
        Insert: Partial<ConteudoEstudo>;
        Update: Partial<ConteudoEstudo>;
        Relationships: [];
      };
      eventos: { Row: Evento; Insert: Partial<Evento>; Update: Partial<Evento>; Relationships: [] };
      preferencias: {
        Row: Preferencias;
        Insert: Partial<Preferencias>;
        Update: Partial<Preferencias>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

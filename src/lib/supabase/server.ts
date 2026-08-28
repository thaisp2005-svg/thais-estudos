import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Cliente do servidor, usando a chave service_role: ignora as políticas de
 * RLS (o banco está fechado para qualquer outra chave, inclusive a anon).
 * Nunca importar isto de um componente/arquivo que roda no navegador.
 */
export async function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

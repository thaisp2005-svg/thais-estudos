import type { ReactNode } from "react";
import { AppShell } from "@/components/nav/AppShell";

// Sem isso, o Next tenta gerar páginas como o Painel como HTML estático no
// build — e elas ficariam com a data e os dados congelados no momento do
// deploy, em vez de atualizar a cada visita.
export const dynamic = "force-dynamic";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

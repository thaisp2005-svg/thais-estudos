import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileTabBar } from "./MobileTabBar";
import { MobileFab } from "./MobileFab";
import { getMateriasEmUso } from "@/lib/data";

export async function AppShell({ children }: { children: ReactNode }) {
  const materiasEmUso = await getMateriasEmUso();

  return (
    <div className="flex min-h-screen">
      <Sidebar materiasEmUso={materiasEmUso} />
      <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      <MobileTabBar />
      <MobileFab />
    </div>
  );
}

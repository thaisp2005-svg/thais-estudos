export function getCreateAction(pathname: string): { href: string; label: string } | null {
  if (pathname.startsWith("/agenda")) return { href: "/agenda/novo", label: "Novo compromisso" };
  if (pathname.startsWith("/estudos")) return { href: "/estudos/novo", label: "Novo conteúdo" };
  if (pathname.startsWith("/materias")) return { href: "/materias/novo", label: "Nova matéria" };
  return null;
}

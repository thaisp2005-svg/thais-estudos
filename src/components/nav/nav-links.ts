export type NavLink = {
  href: string;
  label: string;
  icon: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Painel", icon: "◷" },
  { href: "/estudos", label: "Estudos", icon: "📖" },
  { href: "/agenda", label: "Agenda", icon: "▤" },
  { href: "/materias", label: "Matérias", icon: "🎨" },
  { href: "/configuracoes", label: "Configurações", icon: "⚙" },
];

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

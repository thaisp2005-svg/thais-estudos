"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActive } from "./nav-links";

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-surface md:hidden">
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 pb-2.5 text-[10.5px] font-semibold ${
              active ? "text-accent" : "text-text-dim"
            }`}
          >
            <span
              className={`flex h-[18px] w-[18px] items-center justify-center rounded-md text-[11px] ${
                active ? "bg-accent text-accent-text" : ""
              }`}
              aria-hidden
            >
              {link.icon}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

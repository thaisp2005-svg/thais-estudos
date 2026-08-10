"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCreateAction } from "./create-action";

export function MobileFab() {
  const pathname = usePathname();
  const createAction = getCreateAction(pathname);

  if (!createAction) return null;

  return (
    <Link
      href={createAction.href}
      className="fixed bottom-[78px] right-4 z-20 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-2xl text-accent-text shadow-lg md:hidden"
      aria-label={createAction.label}
    >
      +
    </Link>
  );
}

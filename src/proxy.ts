import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ACESSO } from "@/lib/auth";

/** Tranca o sistema atrás de uma senha única (sem contas/usuários). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const senhaConfigurada = Boolean(process.env.APP_SENHA);
  const autenticado =
    senhaConfigurada && request.cookies.get(COOKIE_ACESSO)?.value === process.env.APP_SENHA;

  if (pathname === "/entrar") {
    if (autenticado) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!autenticado) {
    const destino = new URL("/entrar", request.url);
    destino.searchParams.set("redirect", pathname);
    return NextResponse.redirect(destino);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

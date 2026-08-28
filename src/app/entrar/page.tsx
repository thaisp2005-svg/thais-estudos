import { entrarAction } from "@/lib/actions";
import { inputClass } from "@/components/ui/Field";

export default async function EntrarPage({ searchParams }: PageProps<"/entrar">) {
  const params = await searchParams;
  const erro = params?.erro === "1";
  const redirectParam = params?.redirect;
  const redirectPara = (Array.isArray(redirectParam) ? redirectParam[0] : redirectParam) || "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5">
      <form
        action={entrarAction}
        className="w-full max-w-[300px] rounded-2xl border border-border bg-surface p-7 text-center"
      >
        <input type="hidden" name="redirect" value={redirectPara} />
        <p className="mb-0.5 text-lg font-extrabold">
          Estudo<span className="text-accent">+</span>
        </p>
        <p className="mb-5 text-[12.5px] text-text-dim">Digite a senha para entrar</p>

        {erro && (
          <p className="mb-3 rounded-lg bg-danger-bg px-2.5 py-2 text-left text-xs text-danger">
            Senha incorreta. Tente de novo.
          </p>
        )}

        <label className="mb-3.5 block text-left">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-text-dim">Senha</span>
          <input type="password" name="senha" required autoFocus className={inputClass} />
        </label>

        <button type="submit" className="w-full rounded-xl bg-accent py-2.5 text-sm font-bold text-accent-text">
          Entrar
        </button>
      </form>
    </div>
  );
}

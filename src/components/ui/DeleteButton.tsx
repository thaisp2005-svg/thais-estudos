"use client";

export function DeleteButton({
  mensagem,
  children = "Excluir",
  className,
}: {
  mensagem: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(mensagem)) e.preventDefault();
      }}
      className={
        className ??
        "rounded-lg border border-danger px-3 py-2 text-[13px] font-bold text-danger hover:bg-danger-bg"
      }
    >
      {children}
    </button>
  );
}

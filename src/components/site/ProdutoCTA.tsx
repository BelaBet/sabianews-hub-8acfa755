import { produtoParaCategoria } from "@/lib/comercial";

/**
 * Bloco de produto próprio dentro da matéria.
 *
 * Só aparece quando existe produto configurado para a editoria E o
 * checkoutUrl está preenchido — sem link real, nada é renderizado.
 */
export function ProdutoCTA({ categoriaSlug }: { categoriaSlug: string }) {
  const produto = produtoParaCategoria(categoriaSlug);
  if (!produto) return null;

  return (
    <aside
      aria-label="Oferta do Tá Sabendo?"
      className="my-10 overflow-hidden rounded-xl border-2 border-ink bg-surface-alt"
    >
      <div className="flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">
            Do Tá Sabendo?
          </span>
          <p className="mt-2 font-display text-xl font-black leading-snug text-ink sm:text-2xl">
            {produto.chamada}
          </p>
          <p className="mt-2 text-sm text-ink-soft">{produto.descricao}</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 md:items-center">
          <span className="font-display text-3xl font-black text-ink">{produto.preco}</span>
          <a
            href={produto.checkoutUrl}
            className="inline-flex whitespace-nowrap items-center rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            data-produto={produto.id}
          >
            {produto.cta}
          </a>
          <span className="text-[11px] text-ink-soft">{produto.nome}</span>
        </div>
      </div>
    </aside>
  );
}

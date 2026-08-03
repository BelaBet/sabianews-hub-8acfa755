import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCategorias,
  getCategoria,
  formatarData,
  type Categoria,
  type Materia,
} from "@/lib/data";

type Variant = "hero" | "default" | "compact" | "list";

interface ArticleCardProps {
  m: Materia;
  variant?: Variant;
  /** Categorias já carregadas pelo loader da rota. Sem isso o chip de editoria
   *  não sai no HTML do servidor — ele só aparecia depois da hidratação. */
  categorias?: Categoria[];
  /** Selo opcional ao lado da editoria ("Manchete", "Destaque"). */
  badge?: string;
  /** Nível do heading. O hero assume 1, mas a página de categoria já tem um
   *  <h1> próprio e precisa passar 2 para não duplicar. */
  headingLevel?: 1 | 2 | 3;
  /** Marca a imagem como LCP: carrega adiantado em vez de lazy. */
  priority?: boolean;
}

function useCategoria(m: Materia, categorias?: Categoria[]) {
  const { data } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
    enabled: categorias === undefined,
    initialData: categorias,
  });
  return getCategoria(data ?? [], m.categoria);
}

/** Data única para todos os cards, sempre com <time dateTime> legível por máquina. */
function DataPublicacao({ m, className = "" }: { m: Materia; className?: string }) {
  return (
    <time dateTime={m.atualizadoEm ?? m.publicadoEm} className={className}>
      {formatarData(m.publicadoEm)}
    </time>
  );
}

/** Imagem única para todos os cards: alt vazio (decorativa — o título ao lado
 *  já descreve o link), fallback quando não há imagem, e política de
 *  carregamento consistente. */
function CardImage({
  m,
  className,
  priority = false,
  width,
  height,
}: {
  m: Materia;
  className: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  if (!m.imagem) {
    return <div className={`${className} bg-surface-alt`} aria-hidden="true" />;
  }
  return (
    <img
      src={m.imagem}
      alt=""
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}

export function ArticleCard({
  m,
  variant = "default",
  categorias,
  badge,
  headingLevel,
  priority,
}: ArticleCardProps) {
  const cat = useCategoria(m, categorias);
  const linkProps = { to: "/materia/$slug" as const, params: { slug: m.slug } };

  if (variant === "hero") {
    const Heading = `h${headingLevel ?? 1}` as "h1" | "h2" | "h3";
    return (
      <Link
        {...linkProps}
        className="group relative block overflow-hidden rounded-lg bg-brand-black text-white shadow-editorial"
      >
        <CardImage
          m={m}
          priority={priority ?? true}
          className="h-[260px] w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.02] sm:h-[380px] md:h-[460px] lg:h-[540px]"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            {cat && <span className="category-chip">{cat.nome}</span>}
            {badge && <span className="highlight-chip">{badge}</span>}
          </div>
          <Heading className="mt-3 max-w-3xl font-display text-2xl font-black leading-[1.12] sm:text-3xl md:text-4xl lg:text-5xl lg:leading-tight">
            {m.titulo}
          </Heading>
          {m.subtitulo && (
            <p className="mt-3 text-white/85 max-w-2xl text-sm md:text-base">{m.subtitulo}</p>
          )}
          <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
            <DataPublicacao m={m} />
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} aria-hidden="true" />
              {m.tempoLeitura} min de leitura
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    const Heading = `h${headingLevel ?? 3}` as "h2" | "h3";
    return (
      <Link {...linkProps} className="group flex gap-3 py-3 border-b border-border last:border-0">
        <CardImage
          m={m}
          width={80}
          height={64}
          priority={priority}
          className="h-16 w-20 rounded object-cover shrink-0"
        />
        <div className="min-w-0">
          {cat && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {cat.nome}
            </span>
          )}
          <Heading className="text-sm font-semibold text-ink group-hover:text-primary line-clamp-2">
            {m.titulo}
          </Heading>
          <DataPublicacao m={m} className="mt-1 block text-[11px] text-ink-soft" />
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    const Heading = `h${headingLevel ?? 3}` as "h2" | "h3";
    return (
      <Link {...linkProps} className="group flex items-start gap-4 py-4">
        <time
          dateTime={m.publicadoEm}
          className="w-16 shrink-0 pt-1 font-mono text-xs text-ink-soft"
        >
          {new Date(m.publicadoEm).toLocaleTimeString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {cat && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {cat.nome}
              </span>
            )}
            {m.atualizadoEm && (
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-red-deep)" }}
              >
                Atualizada
              </span>
            )}
          </div>
          <Heading className="font-semibold text-ink group-hover:text-primary">{m.titulo}</Heading>
          {m.resumo && <p className="text-sm text-ink-soft line-clamp-1">{m.resumo}</p>}
        </div>
      </Link>
    );
  }

  const Heading = `h${headingLevel ?? 3}` as "h2" | "h3";
  return (
    <Link
      {...linkProps}
      className="group flex flex-col overflow-hidden rounded-lg bg-surface border border-border hover:shadow-editorial transition"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <CardImage
          m={m}
          priority={priority}
          className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {cat && <span className="category-chip">{cat.nome}</span>}
          <span className="classification-badge">{m.classificacao}</span>
          {badge && <span className="highlight-chip">{badge}</span>}
        </div>
        <Heading className="text-lg font-bold text-ink leading-snug group-hover:text-primary line-clamp-3">
          {m.titulo}
        </Heading>
        {m.resumo && <p className="text-sm text-ink-soft line-clamp-2">{m.resumo}</p>}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-ink-soft">
          <DataPublicacao m={m} />
          <span className="inline-flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {m.tempoLeitura} min
          </span>
        </div>
      </div>
    </Link>
  );
}

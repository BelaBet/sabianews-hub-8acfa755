import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, Mail, X } from "lucide-react";
import { Logo } from "./Logo";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorias } from "@/lib/data";

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
  });
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-editorial flex h-16 items-center justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <button
            className="lg:hidden -ml-1 p-2 text-ink"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="min-w-0 truncate">
            <Logo size="md" />
          </span>
        </div>

        <nav
          aria-label="Editorias"
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-5"
        >
          {categorias.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="whitespace-nowrap text-sm font-semibold text-ink transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {c.nome}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/busca"
            className="hidden whitespace-nowrap sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-primary hover:text-primary"
            aria-label="Buscar"
          >
            <Search size={14} /> Buscar
          </Link>
          <Link
            to="/"
            hash="newsletter"
            className="inline-flex whitespace-nowrap items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:opacity-90 sm:px-3.5"
          >
            <Mail size={14} /> Newsletter
          </Link>
        </div>
      </div>

      {open && (
        <nav aria-label="Menu mobile" className="lg:hidden border-t border-border bg-surface">
          <ul className="container-editorial grid grid-cols-2 gap-2 py-3 sm:grid-cols-3">
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-alt"
                >
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Fita superior */}
      <div className="bg-brand-black text-white text-[11px] uppercase tracking-widest">
        <div className="container-editorial flex h-6 min-w-0 items-center justify-between">
          <span className="truncate font-bold" style={{ color: "var(--brand-yellow)" }}>
            A fofoca que nunca dorme
          </span>
        </div>
      </div>
    </header>
  );
}

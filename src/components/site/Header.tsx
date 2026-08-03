import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, Mail, X } from "lucide-react";
import { Logo } from "./Logo";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorias } from "@/lib/data";

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: categorias = [] } = useQuery({ queryKey: ["categorias"], queryFn: fetchCategorias });
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-editorial flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden -ml-1 p-2 text-ink"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Logo size="md" />
        </div>

        <nav aria-label="Editorias" className="hidden md:flex items-center gap-5">
          {categorias.slice(0, 7).map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="text-sm font-semibold text-ink hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              {c.nome}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/busca"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-primary hover:border-primary transition"
            aria-label="Buscar"
          >
            <Search size={14} /> Buscar
          </Link>
          <Link
            to="/"
            hash="newsletter"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition"
          >
            <Mail size={14} /> Newsletter
          </Link>
        </div>
      </div>

      {open && (
        <nav aria-label="Menu mobile" className="md:hidden border-t border-border bg-surface">
          <ul className="container-editorial py-3 grid grid-cols-2 gap-2">
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
        <div className="container-editorial flex h-6 items-center justify-between">
          <span className="font-bold" style={{ color: "var(--brand-yellow)" }}>
            A fofoca que nunca dorme
          </span>
        </div>
      </div>
    </header>
  );
}

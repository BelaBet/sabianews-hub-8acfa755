import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { SITE_NAME } from "@/lib/site";

type PaginaInstitucional = { label: string; page: string };

const institucional: PaginaInstitucional[] = [
  { label: "Quem Somos", page: "quem-somos" },
  { label: "Política Editorial", page: "politica-editorial" },
  { label: "Política de Correções", page: "correcoes" },
];

const legal: PaginaInstitucional[] = [
  { label: "Política de Privacidade", page: "privacidade" },
  { label: "Política de Cookies", page: "cookies" },
  { label: "Termos de Uso", page: "termos" },
  { label: "Contato", page: "contato" },
];

const negocios: PaginaInstitucional[] = [
  { label: "Anuncie", page: "anuncie" },
  { label: "Trabalhe Conosco", page: "carreiras" },
];

const linkClass = "text-white/70 transition-colors hover:text-white focus-visible:text-white";

function ColunaInstitucional({
  titulo,
  itens,
  extra,
}: {
  titulo: string;
  itens: PaginaInstitucional[];
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">{titulo}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {itens.map((item) => (
          <li key={item.page}>
            <Link to="/institucional/$page" params={{ page: item.page }} className={linkClass}>
              {item.label}
            </Link>
          </li>
        ))}
        {extra}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-brand-black text-white">
      <div className="container-editorial grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="md" invert />
          <p className="mt-3 text-sm text-white/70 max-w-xs">
            A fofoca que nunca dorme. Notícias, bastidores e curiosidades — sempre com apuração.
          </p>
        </div>

        <nav aria-label="Links institucionais" className="contents">
          <ColunaInstitucional titulo="Institucional" itens={institucional} />
          <ColunaInstitucional titulo="Legal" itens={legal} />
          <ColunaInstitucional
            titulo="Negócios"
            itens={negocios}
            extra={
              <>
                <li>
                  {/* hash absoluto: a seção de newsletter só existe na home, então
                      um href="#newsletter" cru não fazia nada nas demais páginas. */}
                  <Link to="/" hash="newsletter" className={linkClass}>
                    Newsletter
                  </Link>
                </li>
                <li>
                  <Link to="/pesquisa-transicao-carreira" className={linkClass}>
                    Pesquisa de carreira
                  </Link>
                </li>
              </>
            }
          />
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-editorial py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-white/50">
          <span>
            © {new Date().getFullYear()} {SITE_NAME} — Todos os direitos reservados.
          </span>
          <nav aria-label="Links legais" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              to="/institucional/$page"
              params={{ page: "privacidade" }}
              className="hover:text-white/80"
            >
              Privacidade
            </Link>
            <Link
              to="/institucional/$page"
              params={{ page: "termos" }}
              className="hover:text-white/80"
            >
              Termos
            </Link>
            <Link
              to="/institucional/$page"
              params={{ page: "contato" }}
              className="hover:text-white/80"
            >
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

import { Logo } from "./Logo";


const cols = [
  {
    title: "Institucional",
    links: [
      { label: "Quem Somos", href: "/institucional/quem-somos" },
      { label: "Política Editorial", href: "/institucional/politica-editorial" },
      { label: "Política de Correções", href: "/institucional/correcoes" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidade", href: "/institucional/privacidade" },
      { label: "Termos de Uso", href: "/institucional/termos" },
      { label: "Contato", href: "/institucional/contato" },
    ],
  },
  {
    title: "Negócios",
    links: [
      { label: "Anuncie", href: "/institucional/anuncie" },
      { label: "Trabalhe Conosco", href: "/institucional/carreiras" },
      { label: "Pesquisa de carreira", href: "/pesquisa-transicao-carreira" },
      { label: "Newsletter", href: "#newsletter" },
      { label: "Painel Editorial", href: "/admin/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-brand-black text-white">
      <div className="container-editorial py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Logo size="md" invert />
          <p className="mt-3 text-sm text-white/70 max-w-xs">
            A fofoca que nunca dorme. Notícias, bastidores e curiosidades — sempre com apuração.
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-widest" style={{ color: "var(--brand-yellow)" }}>
            {"\n"}
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {col.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-editorial py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Tá Sabendo? — Todos os direitos reservados (demo).</span>
          <span>Feito com paixão editorial no Brasil.</span>
        </div>
      </div>
    </footer>
  );
}

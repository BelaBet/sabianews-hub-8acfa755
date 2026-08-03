import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Newsletter } from "@/components/site/Newsletter";
import { TrendingList } from "@/components/site/TrendingList";
import {
  fetchMaterias,
  fetchCategorias,
  getCategoria,
  ultimasMaterias,
  maisLidas,
  formatarData,
} from "@/lib/data";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, HelpCircle, AlertTriangle, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/site/AdSlot";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const [materias, categorias] = await Promise.all([fetchMaterias(), fetchCategorias()]);
      return { materias, categorias };
    } catch (err) {
      console.error("[/] loader failed, returning empty data:", err);
      return { materias: [], categorias: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Tá Sabendo? — A fofoca que nunca dorme" },
      {
        name: "description",
        content:
          "Notícias, bastidores e curiosidades sobre famosos, influenciadores, empresas e tecnologia. Apurado com carinho — e verificado.",
      },
      { property: "og:title", content: "Tá Sabendo? — A fofoca que nunca dorme" },
      {
        property: "og:description",
        content: "Notícias, bastidores e curiosidades sobre famosos, influenciadores, empresas e tecnologia. Apurado com carinho — e verificado.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          name: "Tá Sabendo?",
          slogan: "A fofoca que nunca dorme",
          description: "Portal editorial de notícias, fofocas e curiosidades verificadas.",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { materias, categorias } = Route.useLoaderData();

  if (materias.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container-editorial py-24 text-center text-ink-soft">
          Ainda não há matérias publicadas. Publique a primeira pelo{" "}
          <Link to="/admin" className="text-primary font-semibold hover:underline">painel editorial</Link>.
        </main>
        <Footer />
      </div>
    );
  }

  const manchete = materias.find((m: any) => m.manchete) ?? materias[0];
  const destaques = materias.filter((m: any) => m.destaque && m.slug !== manchete.slug).slice(0, 3);
  const ultimas = ultimasMaterias(materias, 8);
  const top = maisLidas(materias, 5);
  const curiosidades = materias.filter((m: any) => m.categoria === "curiosidades");
  const fatoOuRumor = materias.filter((m: any) => ["Confirmado", "Relatado", "Rumor"].includes(m.classificacao)).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container-editorial pt-6">
          <ArticleCard m={manchete} variant="hero" categorias={categorias} badge="Manchete" priority />
        </section>

        <section className="container-editorial">
          <AdSlot format="leaderboard" label="Publicidade" />
        </section>

        <section className="container-editorial mt-4 grid gap-6 md:grid-cols-3">
          {destaques.map((m: any) => <ArticleCard key={m.slug} m={m} categorias={categorias} headingLevel={2} />)}
        </section>

        <section className="container-editorial mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionTitle title="Últimas notícias" subtitle="Cronológico, atualizado em tempo real" />
            <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface px-4">
              {ultimas.map((m) => (
                <ArticleCard key={m.slug} m={m} variant="list" categorias={categorias} />
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <TrendingList />
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-xl font-black">Mais lidas</h2>
              <ol className="mt-3 space-y-3">
                {top.map((m, i) => (
                  <li key={m.slug} className="flex gap-3">
                    <span className="text-3xl font-black leading-none text-primary/80 w-8 shrink-0">{i + 1}</span>
                    <Link to="/materia/$slug" params={{ slug: m.slug }} className="text-sm font-semibold text-ink hover:text-primary line-clamp-3">
                      {m.titulo}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
            <AdSlot format="rectangle" label="Publicidade" className="my-0" />
          </aside>
        </section>

        {curiosidades.length > 0 && (
          <section className="container-editorial mt-16">
            <SectionTitle title="Tá sabendo disso?" subtitle="Curiosidades rápidas e verificadas" icon={<Sparkles size={18} />} />
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {curiosidades.map((c: any) => (
                <Link
                  key={c.slug}
                  to="/materia/$slug"
                  params={{ slug: c.slug }}
                  className="group relative overflow-hidden rounded-xl p-6 text-white"
                  style={{ background: "var(--gradient-red)" }}
                >
                  <span className="highlight-chip">Curiosidade</span>
                  <h3 className="mt-3 text-xl font-black leading-tight">{c.titulo}</h3>
                  <p className="mt-2 text-sm text-white/85 line-clamp-3">{c.taSabendoDisso ?? c.resumo}</p>
                  <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-white/90 group-hover:underline">
                    Ler mais →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {fatoOuRumor.length > 0 && (
          <section className="container-editorial mt-16">
            <SectionTitle title="Fato ou Rumor" subtitle="A gente separa o que é real do que é papo furado" />
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {fatoOuRumor.map((m: any) => {
                const Icon = m.classificacao === "Confirmado" ? CheckCircle2 : m.classificacao === "Rumor" ? AlertTriangle : HelpCircle;
                const color = m.classificacao === "Confirmado" ? "oklch(0.65 0.17 155)" : m.classificacao === "Rumor" ? "var(--brand-red)" : "oklch(0.75 0.15 80)";
                return (
                  <Link
                    key={m.slug}
                    to="/materia/$slug"
                    params={{ slug: m.slug }}
                    className="rounded-xl border-2 bg-surface p-5 hover:shadow-editorial transition"
                    style={{ borderColor: color }}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color }}>
                      <Icon size={16} /> {m.classificacao}
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-ink leading-snug line-clamp-3">{m.titulo}</h3>
                    <p className="mt-2 text-sm text-ink-soft line-clamp-3">{m.resumo}</p>
                    <div className="mt-3 text-xs text-ink-soft">{formatarData(m.publicadoEm)}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="container-editorial mt-16">
          <Newsletter />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SectionTitle({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-black inline-flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
      </div>
    </div>
  );
}

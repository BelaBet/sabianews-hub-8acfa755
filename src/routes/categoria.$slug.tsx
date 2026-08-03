import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { fetchCategorias, fetchMaterias, getCategoria, materiasPorCategoria } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import { AdSlot } from "@/components/site/AdSlot";

export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params }) => {
    const [categorias, materias] = await Promise.all([fetchCategorias(), fetchMaterias()]);
    const cat = getCategoria(categorias, params.slug);
    if (!cat) throw notFound();
    return { cat, lista: materiasPorCategoria(materias, params.slug) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Categoria" }, { name: "robots", content: "noindex" }] };
    const { cat } = loaderData;
    return {
      meta: [
        { title: `${cat.nome} — Tá Sabendo?` },
        { name: "description", content: cat.descricao },
        { property: "og:title", content: `${cat.nome} — Tá Sabendo?` },
        { property: "og:description", content: cat.descricao },
        { property: "og:url", content: `/categoria/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/categoria/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container-editorial flex-1 py-24 text-center">
        <h1 className="text-4xl font-black">Categoria não encontrada</h1>
        <Link to="/" className="mt-6 inline-block text-primary font-bold">Voltar</Link>
      </div>
      <Footer />
    </div>
  ),
  component: CategoriaPage,
});

function CategoriaPage() {
  const { cat, lista } = Route.useLoaderData();
  const [primeira, ...resto] = lista;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-primary">Início</Link>
            <ChevronRight size={12} />
            <span className="text-ink font-medium">{cat.nome}</span>
          </nav>
        </div>

        <header className="container-editorial mt-6 border-b-2 border-ink pb-6">
          <span className="highlight-chip">Editoria</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-black">{cat.nome}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{cat.descricao}</p>
        </header>

        <section className="container-editorial mt-6">
          <AdSlot format="leaderboard" label="Publicidade" className="my-4" />
        </section>

        {lista.length === 0 ? (
          <div className="container-editorial py-16 text-center text-ink-soft">
            Ainda não temos matérias publicadas nesta editoria.
          </div>
        ) : (
          <>
            <section className="container-editorial mt-2 grid gap-8 lg:grid-cols-[1fr_1fr]">
              {primeira && <ArticleCard m={primeira} variant="hero" categorias={[cat]} headingLevel={2} badge="Destaque" priority />}
              <div className="grid gap-6 sm:grid-cols-2">
                {resto.map((m: any) => <ArticleCard key={m.slug} m={m} categorias={[cat]} headingLevel={2} />)}
              </div>
            </section>
            <section className="container-editorial">
              <AdSlot format="in-article" label="Publicidade" />
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

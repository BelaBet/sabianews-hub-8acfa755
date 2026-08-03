import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { fetchPerfilBySlug, fetchAutores, fetchMaterias, fetchCategorias, getAutor } from "@/lib/data";
import { AdSlot } from "@/components/site/AdSlot";

export const Route = createFileRoute("/perfil/$slug")({
  loader: async ({ params }) => {
    const [perfil, autores, materias, categorias] = await Promise.all([
      fetchPerfilBySlug(params.slug),
      fetchAutores(),
      fetchMaterias(),
      fetchCategorias(),
    ]);
    const autor = getAutor(autores, params.slug);
    if (!perfil && !autor) throw notFound();
    return { perfil, autor, materias, categorias };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Perfil" }, { name: "robots", content: "noindex" }] };
    const nome = loaderData.perfil?.nome ?? loaderData.autor?.nome ?? "Perfil";
    const desc = loaderData.perfil?.descricao ?? loaderData.autor?.bio ?? "";
    return {
      meta: [
        { title: `${nome} — Tá Sabendo?` },
        { name: "description", content: desc },
        { property: "og:title", content: `${nome} — Tá Sabendo?` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: `/perfil/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/perfil/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": loaderData.perfil?.tipo === "Empresa" ? "Organization" : "Person",
              name: nome,
              description: desc,
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="blog-shell flex min-h-screen flex-col">
      <Header />
      <div className="container-editorial flex-1 py-24 text-center">
        <h1 className="text-4xl font-black">Perfil não encontrado</h1>
        <Link to="/" className="mt-6 inline-block text-primary font-bold">Voltar</Link>
      </div>
      <Footer />
    </div>
  ),
  component: PerfilPage,
});

function PerfilPage() {
  const { perfil, autor, materias, categorias } = Route.useLoaderData();
  const nome = perfil?.nome ?? autor!.nome;
  const desc = perfil?.descricao ?? autor!.bio;
  const tipo = perfil?.tipo ?? autor?.cargo ?? "Autor";
  const imagem = perfil?.imagem;
  const rel = perfil
    ? materias.filter((m: any) => m.tags.includes(perfil.slug) || m.titulo.toLowerCase().includes(perfil.nome.toLowerCase().split(" ")[0]))
    : materias.filter((m: any) => m.autor === autor!.slug);

  return (
    <div className="blog-shell flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-brand-black text-white">
          <div className="container-editorial py-12 flex flex-col md:flex-row items-center gap-6">
            {imagem ? (
              <img src={imagem} alt={nome} className="h-32 w-32 rounded-full object-cover border-4 border-primary" />
            ) : (
              <div className="h-32 w-32 rounded-full bg-primary grid place-items-center text-4xl font-black">
                {nome.split(" ").map((n: any) => n[0]).slice(0, 2).join("")}
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <span className="highlight-chip">{tipo}</span>
              <h1 className="mt-2 font-display text-4xl md:text-6xl font-black">{nome}</h1>
              <p className="mt-2 max-w-2xl text-white/80">{desc}</p>
              {perfil?.seguidores && (
                <p className="mt-2 text-sm text-white/70">
                  <span className="font-bold text-white">{perfil.seguidores}</span> seguidores
                </p>
              )}
            </div>
          </div>
        </section>
        <div className="container-editorial mt-6">
          <AdSlot format="leaderboard" label="Publicidade" className="my-2" />
        </div>

        {perfil && perfil.fatos.length > 0 && (
          <section className="container-editorial mt-10">
            <h2 className="font-display text-2xl font-black border-b-2 border-ink pb-2">Fatos rápidos</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-3">
              {perfil.fatos.map((f: any, i: number) => (
                <li key={i} className="rounded-xl border border-border bg-surface p-4 text-sm text-ink">
                  <span className="text-primary font-black">#{i + 1}</span> {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="container-editorial mt-12">
          <h2 className="font-display text-2xl font-black border-b-2 border-ink pb-2">
            {perfil ? "Cobertura relacionada" : "Matérias do autor"}
          </h2>
          {rel.length ? (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rel.map((m: any) => <ArticleCard key={m.slug} m={m} categorias={categorias} headingLevel={3} />)}
            </div>
          ) : (
            <p className="mt-4 text-ink-soft">Sem matérias relacionadas no momento.</p>
          )}
        </section>

        <section className="container-editorial mt-12">
          <AdSlot format="in-article" label="Publicidade" />
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { institucionalPages } from "@/lib/institucional-content";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/institucional/$page")({
  // /institucional/anuncie virou a rota dedicada /anuncie. Redireciona em vez
  // de 404 para não perder o que já estiver indexado ou linkado.
  beforeLoad: ({ params }) => {
    if (params.page === "anuncie") throw redirect({ to: "/anuncie" });
  },
  loader: ({ params }) => {
    const page = institucionalPages[params.page];
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Página" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.page.titulo} — Tá Sabendo?` },
        { name: "description", content: loaderData.page.descricao },
      ],
      links: [{ rel: "canonical", href: `/institucional/${params.page}` }],
    };
  },
  notFoundComponent: () => (
    <div className="blog-shell flex min-h-screen flex-col">
      <Header />
      <div className="container-editorial flex-1 py-24 text-center">
        <h1 className="text-4xl font-black">Página não encontrada</h1>
        <Link to="/" className="mt-6 inline-block text-primary font-bold">Voltar ao início</Link>
      </div>
      <Footer />
    </div>
  ),
  component: InstitucionalPage,
});

function InstitucionalPage() {
  const { page } = Route.useLoaderData();
  return (
    <div className="blog-shell flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-primary">Início</Link>
            <ChevronRight size={12} />
            <span className="text-ink font-medium">{page.titulo}</span>
          </nav>
        </div>
        <article className="container-editorial mt-6 max-w-2xl pb-16">
          <h1 className="font-display text-4xl font-black">{page.titulo}</h1>
          <p className="mt-2 text-ink-soft">{page.descricao}</p>
          <div className="mt-6 space-y-4 text-ink leading-relaxed">
            {page.corpo.map((p: string, i: number) => <p key={i}>{p}</p>)}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

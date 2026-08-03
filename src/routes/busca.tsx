import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { fetchMaterias } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/busca")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Buscar — Tá Sabendo?" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: BuscaPage,
});

function BuscaPage() {
  const { q } = Route.useSearch();
  const [termo, setTermo] = useState(q);
  const materiasQ = useQuery({ queryKey: ["materias"], queryFn: fetchMaterias });
  const materias = materiasQ.data ?? [];

  const resultados = useMemo(() => {
    const t = termo.trim().toLowerCase();
    if (!t) return [];
    return materias.filter(
      (m) =>
        m.titulo.toLowerCase().includes(t) ||
        m.resumo.toLowerCase().includes(t) ||
        m.tags.some((tag) => tag.toLowerCase().includes(t)),
    );
  }, [materias, termo]);

  return (
    <div className="blog-shell flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-10 max-w-2xl">
          <h1 className="font-display text-3xl font-black">Buscar</h1>
          <div className="mt-4 relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              autoFocus
              placeholder="Digite um termo, nome ou assunto…"
              className="pl-9"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
            />
          </div>
        </div>

        <section className="container-editorial mt-8">
          {termo.trim() === "" ? (
            <p className="text-ink-soft">Digite algo para buscar entre as matérias publicadas.</p>
          ) : materiasQ.isLoading ? (
            <p className="text-ink-soft">Carregando…</p>
          ) : resultados.length === 0 ? (
            <p className="text-ink-soft">Nenhum resultado para "{termo}".</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((m) => <ArticleCard key={m.slug} m={m} />)}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

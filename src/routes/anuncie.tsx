import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/lib/supabase";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import {
  formatosComerciais,
  metricasAudiencia,
  perfilEditorial,
  emailComercial,
} from "@/lib/comercial";

export const Route = createFileRoute("/anuncie")({
  head: () => ({
    meta: [
      { title: `Anuncie no ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Formatos de publicidade, conteúdo patrocinado e patrocínio de newsletter no Tá Sabendo?. Fale com o time comercial.",
      },
      { property: "og:title", content: `Anuncie no ${SITE_NAME}` },
      { property: "og:url", content: absoluteUrl("/anuncie") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/anuncie") }],
  }),
  component: AnunciePage,
});

type Estado = "idle" | "enviando" | "ok" | "erro";

function AnunciePage() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState<string | null>(null);
  const [formatos, setFormatos] = useState<string[]>([]);
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  function alterna(nome: string) {
    setFormatos((atual) =>
      atual.includes(nome) ? atual.filter((f) => f !== nome) : [...atual, nome],
    );
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    setErro(null);

    const { error } = await supabase.from("contatos_comerciais").insert({
      nome: form.nome.trim(),
      empresa: form.empresa.trim() || null,
      email: form.email.trim().toLowerCase(),
      telefone: form.telefone.trim() || null,
      formatos,
      mensagem: form.mensagem.trim() || null,
      origem: typeof window !== "undefined" ? window.location.pathname : null,
    });

    if (error) {
      console.error("[anuncie] falha ao registrar contato:", error);
      setErro("Não conseguimos enviar agora. Tente novamente em instantes.");
      setEstado("erro");
      return;
    }
    setEstado("ok");
  }

  const campo =
    "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary";
  const rotulo = "text-xs font-bold uppercase tracking-widest text-ink-soft";

  return (
    <div className="blog-shell flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-primary">
              Início
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="font-medium text-ink">Anuncie</span>
          </nav>
        </div>

        <header className="container-editorial mt-6 border-b-2 border-ink pb-6">
          <span className="highlight-chip">Comercial</span>
          <h1 className="mt-3 font-display text-3xl font-black sm:text-4xl lg:text-5xl">
            Anuncie no {SITE_NAME}
          </h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Conteúdo sobre dinheiro, comportamento e negócios para quem lê até o fim. Trabalhamos
            com formatos nativos e patrocínio — sempre identificados como publicidade, como manda
            nossa política editorial.
          </p>
        </header>

        {metricasAudiencia.length > 0 && (
          <section className="container-editorial mt-10">
            <h2 className="font-display text-2xl font-black">Audiência</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricasAudiencia.map((m) => (
                <div key={m.rotulo} className="rounded-xl border border-border bg-surface p-5">
                  <dt className={rotulo}>{m.rotulo}</dt>
                  <dd className="mt-1 font-display text-3xl font-black text-ink">{m.valor}</dd>
                  {m.detalhe && <p className="mt-1 text-xs text-ink-soft">{m.detalhe}</p>}
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="container-editorial mt-10">
          <h2 className="font-display text-2xl font-black">Sobre o que falamos</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {perfilEditorial.map((tema) => (
              <li
                key={tema}
                className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink-soft"
              >
                {tema}
              </li>
            ))}
          </ul>
        </section>

        <section className="container-editorial mt-10">
          <h2 className="font-display text-2xl font-black">Formatos</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {formatosComerciais.map((f) => (
              <article key={f.nome} className="rounded-xl border border-border bg-surface p-5">
                <h3 className="font-display text-lg font-black text-ink">{f.nome}</h3>
                <p className="mt-2 text-sm text-ink-soft">{f.descricao}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">
                  {f.entrega}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-editorial mt-12 max-w-2xl pb-16">
          <h2 className="font-display text-2xl font-black">Fale com a gente</h2>

          {estado === "ok" ? (
            <p
              role="status"
              className="mt-4 rounded-xl border-2 border-ink bg-surface-alt p-6 text-ink"
            >
              Recebemos seu contato. Retornamos com o media kit e as condições em até dois dias
              úteis.
            </p>
          ) : (
            <form onSubmit={enviar} className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={rotulo} htmlFor="nome">
                    Nome
                  </label>
                  <input
                    id="nome"
                    required
                    minLength={2}
                    maxLength={150}
                    className={`mt-1.5 ${campo}`}
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className={rotulo} htmlFor="empresa">
                    Empresa
                  </label>
                  <input
                    id="empresa"
                    maxLength={150}
                    className={`mt-1.5 ${campo}`}
                    value={form.empresa}
                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  />
                </div>
                <div>
                  <label className={rotulo} htmlFor="email">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={320}
                    className={`mt-1.5 ${campo}`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className={rotulo} htmlFor="telefone">
                    Telefone ou WhatsApp
                  </label>
                  <input
                    id="telefone"
                    inputMode="tel"
                    maxLength={40}
                    className={`mt-1.5 ${campo}`}
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  />
                </div>
              </div>

              <fieldset>
                <legend className={rotulo}>Formatos de interesse</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formatosComerciais.map((f) => {
                    const ativo = formatos.includes(f.nome);
                    return (
                      <button
                        type="button"
                        key={f.nome}
                        onClick={() => alterna(f.nome)}
                        aria-pressed={ativo}
                        className={`rounded-full border px-4 py-1.5 text-sm transition ${
                          ativo
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-ink-soft hover:border-primary hover:text-primary"
                        }`}
                      >
                        {f.nome}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label className={rotulo} htmlFor="mensagem">
                  Conte um pouco do que você precisa
                </label>
                <textarea
                  id="mensagem"
                  rows={4}
                  maxLength={2000}
                  className={`mt-1.5 ${campo}`}
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {estado === "enviando" ? "Enviando…" : "Solicitar media kit"}
                </button>
                {emailComercial && (
                  <span className="text-sm text-ink-soft">
                    ou escreva para{" "}
                    <a href={`mailto:${emailComercial}`} className="text-primary hover:underline">
                      {emailComercial}
                    </a>
                  </span>
                )}
              </div>

              {erro && (
                <p role="alert" className="text-sm font-semibold text-primary">
                  {erro}
                </p>
              )}
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Estado = "idle" | "enviando" | "ok" | "erro";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    setMensagem(null);

    const { error } = await supabase.from("newsletter_inscricoes").insert({
      email: email.trim().toLowerCase(),
      consentimento,
      origem: typeof window !== "undefined" ? window.location.pathname : null,
    });

    if (error) {
      // 23505 = unique_violation: e-mail ja inscrito. Para quem assina isso e
      // sucesso — e nao confirmamos nem negamos que o endereco ja existe, para
      // o formulario nao virar oraculo de e-mails cadastrados.
      if (error.code === "23505") {
        setEstado("ok");
        setMensagem("Pronto! Você vai receber a próxima edição.");
        return;
      }
      console.error("[newsletter] falha ao inscrever:", error);
      setEstado("erro");
      setMensagem("Não conseguimos concluir agora. Tente novamente em instantes.");
      return;
    }

    setEstado("ok");
    setMensagem("Pronto! Você vai receber a próxima edição.");
    setEmail("");
    setConsentimento(false);
  }

  return (
    <section id="newsletter" className="relative overflow-hidden rounded-xl bg-brand-black text-white p-8 md:p-12">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30" style={{ background: "var(--gradient-red)" }} />
      <div className="relative max-w-2xl">
        <span className="highlight-chip">Newsletter</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-black leading-tight">
          Receba a fofoca antes que ela esfrie
        </h2>
        <p className="mt-2 text-white/75">
          Um resumo diário no seu e-mail: manchetes, bastidores e curiosidades verificadas.
        </p>

        {estado === "ok" ? (
          <p role="status" className="mt-5 rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold">
            {mensagem}
          </p>
        ) : (
          <>
            <form className="mt-5 flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="nl-email">E-mail</label>
              <input
                id="nl-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 rounded-md bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {estado === "enviando" ? "Enviando…" : "Quero receber"}
              </button>
            </form>

            <label className="mt-3 flex items-start gap-2 text-xs text-white/60">
              <input
                type="checkbox"
                required
                checked={consentimento}
                onChange={(e) => setConsentimento(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Concordo em receber e-mails e li a{" "}
                <a href="/institucional/privacidade" className="underline hover:text-white">
                  Política de Privacidade
                </a>
                .
              </span>
            </label>
          </>
        )}

        {estado === "erro" && mensagem && (
          <p role="alert" className="mt-3 text-xs font-semibold text-white">
            {mensagem}
          </p>
        )}
      </div>
    </section>
  );
}

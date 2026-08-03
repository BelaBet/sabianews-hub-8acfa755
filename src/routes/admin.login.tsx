import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Painel Editorial" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setInfo("Enviamos um link de redefinição para o seu e-mail. Verifique a caixa de entrada e o spam.");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo(
          "Conta criada. Se a confirmação por e-mail estiver ativada no projeto, verifique sua caixa de entrada antes de entrar.",
        );
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-editorial">
        <h1 className="font-display text-2xl font-black text-center">
          TÁ SABENDO<span className="ml-0.5 inline-block rounded-sm bg-primary px-1 text-white text-lg">?</span>
        </h1>
        <p className="mt-1 text-center text-sm text-ink-soft">
          {mode === "forgot" ? "Recuperar acesso" : "Painel Editorial"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-primary">{info}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Aguarde…"
              : mode === "login"
                ? "Entrar"
                : mode === "signup"
                  ? "Criar conta"
                  : "Enviar link de redefinição"}
          </Button>
        </form>

        {mode === "login" && (
          <button
            type="button"
            className="mt-4 w-full text-center text-xs text-ink-soft hover:text-primary"
            onClick={() => {
              setMode("forgot");
              setError(null);
              setInfo(null);
            }}
          >
            Esqueci a senha
          </button>
        )}

        <button
          type="button"
          className="mt-2 w-full text-center text-xs text-ink-soft hover:text-primary"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setInfo(null);
          }}
        >
          {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho conta — entrar"}
        </button>

        <Link to="/" className="mt-6 block text-center text-xs text-ink-soft hover:text-primary">
          ← Voltar ao site
        </Link>

        {mode === "signup" && (
          <p className="mt-4 text-[11px] text-ink-soft text-center">
            A primeira conta criada no projeto vira administradora automaticamente.
          </p>
        )}
      </div>
    </div>
  );
}

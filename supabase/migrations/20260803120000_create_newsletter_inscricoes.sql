-- Newsletter real: substitui o formulário de demonstração que apenas exibia
-- um alert() e descartava o e-mail. Segue o mesmo padrão de segurança já usado
-- em pesquisa_transicao_carreira: anon só pode INSERT, leitura só para admin.

CREATE TABLE IF NOT EXISTS public.newsletter_inscricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  consentimento BOOLEAN NOT NULL DEFAULT FALSE,
  origem TEXT,
  confirmado_em TIMESTAMPTZ,
  cancelado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_email_formato CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT newsletter_email_limite CHECK (char_length(email) <= 320),
  CONSTRAINT newsletter_origem_limite CHECK (origem IS NULL OR char_length(origem) <= 300)
);

-- Um e-mail por base. O componente trata 23505 como sucesso, para o formulário
-- não revelar quais endereços já estão cadastrados.
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_inscricoes_email_key
  ON public.newsletter_inscricoes (lower(email));

ALTER TABLE public.newsletter_inscricoes ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.newsletter_inscricoes FROM anon, authenticated;
GRANT INSERT ON TABLE public.newsletter_inscricoes TO anon, authenticated;
GRANT SELECT ON TABLE public.newsletter_inscricoes TO authenticated;

-- Inscrição pública, mas só com consentimento explícito registrado (LGPD:
-- guardar o e-mail sem base legal é o que o formulário de demo fazia pior).
CREATE POLICY "Inscricao publica na newsletter"
ON public.newsletter_inscricoes
FOR INSERT
TO anon, authenticated
WITH CHECK (consentimento IS TRUE);

CREATE POLICY "Administradores leem inscricoes"
ON public.newsletter_inscricoes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.platform_roles
    WHERE platform_roles.user_id = auth.uid()
      AND platform_roles.role = 'admin'
  )
);

COMMENT ON TABLE public.newsletter_inscricoes IS
  'Inscritos na newsletter do Tá Sabendo?. Leitura restrita a administradores.';

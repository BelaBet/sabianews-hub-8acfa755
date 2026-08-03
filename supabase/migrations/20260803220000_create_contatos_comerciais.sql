-- Leads comerciais vindos da página /anuncie.
-- Mesmo padrão de segurança de newsletter_inscricoes e
-- pesquisa_transicao_carreira: anon só INSERT, leitura restrita a admin.

CREATE TABLE IF NOT EXISTS public.contatos_comerciais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  empresa TEXT,
  email TEXT NOT NULL,
  telefone TEXT,
  formatos TEXT[] NOT NULL DEFAULT '{}',
  mensagem TEXT,
  origem TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT contatos_nome_limite CHECK (char_length(nome) BETWEEN 2 AND 150),
  CONSTRAINT contatos_email_formato CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT contatos_email_limite CHECK (char_length(email) <= 320),
  CONSTRAINT contatos_empresa_limite CHECK (empresa IS NULL OR char_length(empresa) <= 150),
  CONSTRAINT contatos_telefone_limite CHECK (telefone IS NULL OR char_length(telefone) <= 40),
  CONSTRAINT contatos_mensagem_limite CHECK (mensagem IS NULL OR char_length(mensagem) <= 2000),
  CONSTRAINT contatos_origem_limite CHECK (origem IS NULL OR char_length(origem) <= 300),
  CONSTRAINT contatos_status_check CHECK (status IN ('novo', 'em contato', 'proposta', 'fechado', 'perdido'))
);

ALTER TABLE public.contatos_comerciais ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.contatos_comerciais FROM anon, authenticated;
GRANT INSERT ON TABLE public.contatos_comerciais TO anon, authenticated;
GRANT SELECT ON TABLE public.contatos_comerciais TO authenticated;

CREATE POLICY "Contato comercial publico"
ON public.contatos_comerciais
FOR INSERT
TO anon, authenticated
WITH CHECK (
  cardinality(formatos) BETWEEN 0 AND 8
  AND status = 'novo'
);

CREATE POLICY "Administradores leem contatos comerciais"
ON public.contatos_comerciais
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

CREATE INDEX IF NOT EXISTS contatos_comerciais_created_at_idx
  ON public.contatos_comerciais (created_at DESC);

COMMENT ON TABLE public.contatos_comerciais IS
  'Leads comerciais da página /anuncie. Leitura restrita a administradores.';

REVOKE ALL ON public.newsletter_inscricoes FROM anon;
REVOKE ALL ON public.newsletter_inscricoes FROM authenticated;
GRANT INSERT ON public.newsletter_inscricoes TO anon;
GRANT SELECT, INSERT ON public.newsletter_inscricoes TO authenticated;
GRANT ALL ON public.newsletter_inscricoes TO service_role;
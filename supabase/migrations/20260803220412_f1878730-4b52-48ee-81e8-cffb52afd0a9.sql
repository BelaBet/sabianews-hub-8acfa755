CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

DROP POLICY IF EXISTS "Usuários autenticados gerenciam artigos" ON public.articles;

CREATE POLICY "Editores gerenciam artigos"
ON public.articles
FOR ALL
TO authenticated
USING (public.is_platform_editor())
WITH CHECK (public.is_platform_editor());
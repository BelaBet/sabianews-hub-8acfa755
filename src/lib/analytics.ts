/**
 * GA4 e verificação do Search Console.
 *
 * Ambos são opt-in por variável de ambiente: sem o ID configurado, nada é
 * carregado. Isso existe para o build funcionar antes de você ter as
 * credenciais, e para nunca vazar um Measurement ID de outro projeto se
 * as envs não forem configuradas neste deploy.
 *
 *   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *   VITE_GSC_VERIFICATION=<conteúdo do content= da meta tag do Search Console>
 *
 * Consent Mode v2: por padrão, tanto ad_storage quanto analytics_storage
 * começam DENIED. Sem uma CMP no ar, o GA4 não grava cookie nem identifica
 * visitante — ele soma pings agregados e modela o resto (comportamento
 * "cookieless pings" documentado pelo Google). Isso é proposital: dá para
 * medir volume de tráfego hoje sem violar a LGPD, e quando a CMP entrar
 * (necessária de qualquer forma para MCM/header bidding), basta chamar
 * updateConsent() na resposta do banner para os dois modos passarem a
 * "granted" e a medição virar completa.
 */

// Fallback hardcoded, no mesmo padrão de SITE_URL (lib/site.ts) e das chaves
// do Supabase (lib/supabase.ts): a propriedade GA4 já existe e este é o
// Measurement ID de produção, então o site mede tráfego mesmo se o deploy
// não tiver VITE_GA_MEASUREMENT_ID configurada. Para apontar outra
// propriedade (ex.: ambiente de staging), defina a env var — ela sempre
// tem prioridade sobre o fallback.
const FALLBACK_GA_MEASUREMENT_ID = "G-MLZG3D3YNB";

export const GA_MEASUREMENT_ID: string | undefined =
  import.meta.env.VITE_GA_MEASUREMENT_ID || FALLBACK_GA_MEASUREMENT_ID;
export const GSC_VERIFICATION: string | undefined = import.meta.env.VITE_GSC_VERIFICATION;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Rotas que não entram na medição de audiência pública. Não é sobre
 * esconder do Google — /admin já é noindex — é sobre não sujar o media kit
 * com sessão sua de trabalho. Um media kit que conta login como leitor
 * perde credibilidade na primeira auditoria de um anunciante.
 */
export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/** Dispara pageview manual. gtag(config) já não manda automático (send_page_view: false no root), então cada navegação client-side passa por aqui. */
export function trackPageview(pathname: string, search?: string) {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) return;
  if (isAdminPath(pathname)) return;
  window.gtag("event", "page_view", {
    page_path: search ? `${pathname}${search}` : pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Chame isto quando a CMP (ainda não implementada) receber consentimento explícito. */
export function updateConsent(granted: boolean) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
  });
}

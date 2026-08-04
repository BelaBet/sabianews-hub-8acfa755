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
// do Supabase (lib/supabase.ts): a propriedade GA4 já existe e o site mede
// tráfego mesmo se o deploy não tiver as env vars configuradas. Para apontar
// outra propriedade (ex.: staging), defina a env var — ela sempre tem
// prioridade sobre o fallback.
//
// Carregamos com o Google Tag (prefixo GT-), não com o Measurement ID do
// GA4 (prefixo G-) diretamente. São tag IDs "interchangeable" segundo a doc
// oficial (developers.google.com/tag-platform/gtagjs/configure) — o GT- é o
// container que o Google agora emite ao lado do G-, pensado para permitir
// ligar produtos futuros (Google Ads, Floodlight) só pela interface do
// Google, sem precisar tocar de novo no código do site.
const FALLBACK_GOOGLE_TAG_ID = "GT-WP45DRCV";
const FALLBACK_GA_MEASUREMENT_ID = "G-MLZG3D3YNB";

export const GOOGLE_TAG_ID: string = import.meta.env.VITE_GOOGLE_TAG_ID || FALLBACK_GOOGLE_TAG_ID;
/** Measurement ID do GA4. Mantido para referência e para o dia em que
 *  precisarmos de um config explícito adicional (ex.: outra propriedade GA4
 *  no mesmo container). Hoje o GOOGLE_TAG_ID sozinho já basta, porque é o
 *  container ao qual essa propriedade está ligada. */
export const GA_MEASUREMENT_ID: string =
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
  if (typeof window === "undefined" || !window.gtag || !GOOGLE_TAG_ID) return;
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

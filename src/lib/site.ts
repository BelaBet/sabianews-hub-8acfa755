// Fonte única da identidade pública do portal.
// Antes o domínio estava repetido em sitemap.xml.ts, news-sitemap.xml.ts e
// robots.txt, e ausente em todo o resto — por isso canonical, og:url e o
// BreadcrumbList saíam relativos. Tudo que precisa de URL absoluta passa aqui.
//
// Para publicar em outro domínio, defina VITE_SITE_URL no ambiente.

export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://sabia.blog").replace(/\/+$/, "");

export const SITE_NAME = "Tá Sabendo?";
export const SITE_TAGLINE = "A fofoca que nunca dorme";
export const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  "Notícias, bastidores e curiosidades sobre famosos, influenciadores, empresas e tecnologia. Apurado com carinho — e verificado.";

/** Converte um caminho interno em URL absoluta. Aceita URL já absoluta sem alterar. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Imagem de compartilhamento padrão (1200x630), servida pelo próprio domínio. */
export const OG_IMAGE = absoluteUrl("/og-default.png");
export const OG_IMAGE_ALT = `${SITE_NAME} — ${SITE_TAGLINE}`;

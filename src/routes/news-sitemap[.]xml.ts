import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fetchMaterias } from "@/lib/data";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const BASE_URL = SITE_URL;
// Google News só considera conteúdo publicado nas últimas 48 horas.
const MAX_AGE_DAYS = 2;
// Janela de fallback para evitar sitemap vazio quando não há matérias recentes.
const FALLBACK_MAX_AGE_DAYS = 30;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let materias: Awaited<ReturnType<typeof fetchMaterias>> = [];
        try {
          // fetchMaterias já retorna apenas status Publicada/Atualizada
          materias = await fetchMaterias();
        } catch (e) {
          console.error("news-sitemap: failed to fetch matérias", e);
        }

        const now = Date.now();
        const recentes = materias
          .filter((m) => {
            const publicado = new Date(m.publicadoEm).getTime();
            if (Number.isNaN(publicado)) return false;
            return (now - publicado) / 86400000 <= MAX_AGE_DAYS;
          })
          .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));

        // Se não houver matérias nas últimas 48h, expande a janela para o fallback
        // para que o sitemap nunca fique vazio, mas mantém o limite de 1000 URLs.
        const selecionadas = (recentes.length > 0
          ? recentes
          : materias
              .filter((m) => {
                const publicado = new Date(m.publicadoEm).getTime();
                if (Number.isNaN(publicado)) return false;
                return (now - publicado) / 86400000 <= FALLBACK_MAX_AGE_DAYS;
              })
              .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm))
        ).slice(0, 1000);

        const urls = selecionadas.map((m) => {
          const publicado = new Date(m.publicadoEm).toISOString();
          const atualizado = new Date(m.atualizadoEm ?? m.publicadoEm).toISOString();
          return [
            `  <url>`,
            `    <loc>${BASE_URL}/materia/${escapeXml(m.slug)}</loc>`,
            `    <lastmod>${atualizado}</lastmod>`,
            `    <news:news>`,
            `      <news:publication>`,
            `        <news:name>${escapeXml(SITE_NAME)}</news:name>`,
            `        <news:language>pt-BR</news:language>`,
            `      </news:publication>`,
            `      <news:publication_date>${publicado}</news:publication_date>`,
            `      <news:title><![CDATA[${m.titulo}]]></news:title>`,
            m.tags.length ? `      <news:keywords>${escapeXml(m.tags.join(", "))}</news:keywords>` : null,
            `    </news:news>`,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=600" },
        });
      },
    },
  },
});

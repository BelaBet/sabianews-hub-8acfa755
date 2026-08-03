import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fetchMaterias, fetchCategorias, fetchPerfis } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { institucionalPages } from "@/lib/institucional-content";

const BASE_URL = SITE_URL;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [materias, categorias, perfis] = await Promise.all([
          fetchMaterias(),
          fetchCategorias(),
          fetchPerfis(),
        ]);
        const entries = [
          { path: "/", changefreq: "hourly", priority: "1.0" },
          { path: "/anuncie", changefreq: "monthly", priority: "0.5" },
          ...categorias.map((c) => ({
            path: `/categoria/${c.slug}`,
            changefreq: "hourly",
            priority: "0.8",
          })),
          ...materias.map((m) => ({
            path: `/materia/${m.slug}`,
            lastmod: (m.atualizadoEm ?? m.publicadoEm).slice(0, 10),
            changefreq: "daily",
            priority: "0.9",
          })),
          ...perfis.map((p) => ({
            path: `/perfil/${p.slug}`,
            changefreq: "weekly",
            priority: "0.6",
          })),
          // Páginas institucionais (privacidade, termos, contato, cookies...).
          // Ficavam de fora do sitemap mesmo sendo exatamente o que AdSense e
          // Google News procuram ao avaliar um veículo.
          ...Object.keys(institucionalPages).map((slug) => ({
            path: `/institucional/${slug}`,
            changefreq: "monthly",
            priority: "0.3",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            "lastmod" in e && e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=1800" },
        });
      },
    },
  },
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import OpenAI from "openai";

// NOTA: confirmar se o projeto já usa `@tanstack/react-start` ou
// `@tanstack/start` (nome do pacote mudou entre versões) assim que eu
// tiver acesso ao repo de novo — ajustar o import acima se necessário.

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─────────────────────────────────────────────────────────────
// Analisar SEO
// ─────────────────────────────────────────────────────────────

const analyzeSeoSchema = z.object({
  title: z.string().optional().default(""),
  content: z.string().min(200),
  currentCategory: z.string().optional().default(""),
});

const seoAnalysisSchema = z.object({
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()).max(12),
  metaTitle: z.string().max(60),
  metaDescription: z.string().max(160),
  suggestedSlug: z.string(),
  searchIntent: z.enum([
    "informational",
    "commercial",
    "transactional",
    "navigational",
  ]),
  entities: z.array(z.string()).max(20),
  questions: z.array(z.string()).max(10),
  suggestedCategory: z.string(),
  suggestedTags: z.array(z.string()).max(10),
  seoScore: z.number().min(0).max(100),
  recommendations: z.array(z.string()).max(8),
});

export const analyzeSeo = createServerFn({ method: "POST" })
  .validator(analyzeSeoSchema)
  .handler(async ({ data }) => {
    try {
      const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `
Você é um especialista em SEO editorial brasileiro.

Analise o artigo e devolva somente JSON válido.

Regras:
- Não invente fatos.
- Trabalhe apenas com o conteúdo enviado.
- Identifique uma palavra-chave principal natural.
- Gere palavras-chave secundárias semanticamente relacionadas.
- Meta title com no máximo 60 caracteres.
- Meta description com no máximo 160 caracteres.
- Slug curto, sem acentos e com hífens.
- Perguntas devem ser realmente respondidas pelo conteúdo.
- Entidades podem incluir pessoas, empresas, locais, marcas, produtos ou conceitos relevantes.
- Avalie o SEO de 0 a 100.
- Recomendações devem ser objetivas.
- Não pratique keyword stuffing.
- Responda em português do Brasil.
                `.trim(),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
Título atual:
${data.title || "Não informado"}

Categoria atual:
${data.currentCategory || "Não informada"}

Conteúdo:
${data.content}
                `.trim(),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "seo_analysis",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                primaryKeyword: { type: "string" },
                secondaryKeywords: { type: "array", items: { type: "string" }, maxItems: 12 },
                metaTitle: { type: "string", maxLength: 60 },
                metaDescription: { type: "string", maxLength: 160 },
                suggestedSlug: { type: "string" },
                searchIntent: {
                  type: "string",
                  enum: ["informational", "commercial", "transactional", "navigational"],
                },
                entities: { type: "array", items: { type: "string" }, maxItems: 20 },
                questions: { type: "array", items: { type: "string" }, maxItems: 10 },
                suggestedCategory: { type: "string" },
                suggestedTags: { type: "array", items: { type: "string" }, maxItems: 10 },
                seoScore: { type: "number", minimum: 0, maximum: 100 },
                recommendations: { type: "array", items: { type: "string" }, maxItems: 8 },
              },
              required: [
                "primaryKeyword", "secondaryKeywords", "metaTitle", "metaDescription",
                "suggestedSlug", "searchIntent", "entities", "questions",
                "suggestedCategory", "suggestedTags", "seoScore", "recommendations",
              ],
            },
          },
        },
      });

      return seoAnalysisSchema.parse(JSON.parse(response.output_text));
    } catch (error) {
      console.error("Erro na análise SEO:", error);
      throw new Error("Não foi possível analisar o SEO da matéria.");
    }
  });

// ─────────────────────────────────────────────────────────────
// Otimizar artigo
// ─────────────────────────────────────────────────────────────

const optimizeArticleSchema = z.object({
  title: z.string().optional().default(""),
  content: z.string().min(300),
  excerpt: z.string().optional().default(""),
  primaryKeyword: z.string().optional().default(""),
  secondaryKeywords: z.array(z.string()).optional().default([]),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  category: z.string().optional().default(""),
  entities: z.array(z.string()).optional().default([]),
  questions: z.array(z.string()).optional().default([]),
});

const articleOptimizationSchema = z.object({
  optimizedTitle: z.string(),
  optimizedContent: z.string(),
  optimizedExcerpt: z.string(),
  optimizedMetaTitle: z.string().max(60),
  optimizedMetaDescription: z.string().max(160),
  optimizedSlug: z.string(),
  improvedScore: z.number().min(0).max(100),
  changes: z.array(
    z.object({
      type: z.enum(["title", "heading", "clarity", "seo", "faq", "structure", "internal_link"]),
      description: z.string(),
    })
  ),
  suggestedHeadings: z.array(z.string()),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  internalLinks: z.array(z.object({ anchorText: z.string(), topic: z.string() })),
  recommendations: z.array(z.string()),
});

export const optimizeArticle = createServerFn({ method: "POST" })
  .validator(optimizeArticleSchema)
  .handler(async ({ data }) => {
    try {
      const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `
Você é o editor-chefe e especialista em SEO do portal Tá Sabendo?.

Otimize a matéria para:
- Google Search;
- Google Discover;
- Google News;
- ChatGPT;
- Gemini;
- Perplexity;
- Copilot;
- leitura humana.

Regras obrigatórias:
1. Não invente fatos.
2. Não acrescente dados que não estejam no artigo.
3. Não altere nomes, datas ou valores.
4. Não pratique keyword stuffing.
5. Preserve o significado e o tom editorial.
6. Melhore clareza, estrutura e escaneabilidade.
7. Use H2 e H3 quando necessário.
8. Use a palavra-chave naturalmente.
9. Não transforme o texto em propaganda.
10. Não use clickbait enganoso.
11. A FAQ só pode usar informações existentes.
12. Escreva em português do Brasil.
13. Entregue o artigo completo.
14. Responda somente com JSON válido.
                `.trim(),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
Título:
${data.title}

Resumo:
${data.excerpt}

Categoria:
${data.category}

Palavra-chave principal:
${data.primaryKeyword}

Palavras-chave secundárias:
${data.secondaryKeywords.join(", ")}

Meta title:
${data.metaTitle}

Meta description:
${data.metaDescription}

Entidades:
${data.entities.join(", ")}

Perguntas:
${data.questions.join("\n")}

Texto completo:
${data.content}
                `.trim(),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "article_optimization",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                optimizedTitle: { type: "string" },
                optimizedContent: { type: "string" },
                optimizedExcerpt: { type: "string" },
                optimizedMetaTitle: { type: "string", maxLength: 60 },
                optimizedMetaDescription: { type: "string", maxLength: 160 },
                optimizedSlug: { type: "string" },
                improvedScore: { type: "number", minimum: 0, maximum: 100 },
                changes: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      type: {
                        type: "string",
                        enum: ["title", "heading", "clarity", "seo", "faq", "structure", "internal_link"],
                      },
                      description: { type: "string" },
                    },
                    required: ["type", "description"],
                  },
                },
                suggestedHeadings: { type: "array", items: { type: "string" } },
                faq: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: { question: { type: "string" }, answer: { type: "string" } },
                    required: ["question", "answer"],
                  },
                },
                internalLinks: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: { anchorText: { type: "string" }, topic: { type: "string" } },
                    required: ["anchorText", "topic"],
                  },
                },
                recommendations: { type: "array", items: { type: "string" } },
              },
              required: [
                "optimizedTitle", "optimizedContent", "optimizedExcerpt", "optimizedMetaTitle",
                "optimizedMetaDescription", "optimizedSlug", "improvedScore", "changes",
                "suggestedHeadings", "faq", "internalLinks", "recommendations",
              ],
            },
          },
        },
      });

      return articleOptimizationSchema.parse(JSON.parse(response.output_text));
    } catch (error) {
      console.error("Erro ao otimizar matéria:", error);
      throw new Error("Não foi possível otimizar a matéria.");
    }
  });

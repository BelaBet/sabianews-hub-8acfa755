/**
 * Configuração comercial do portal.
 *
 * Tudo que muda com frequência — preço, link de checkout, números do media
 * kit, e-mail comercial — mora aqui, para não ficar espalhado por componente.
 *
 * Os campos marcados com PREENCHER ainda não têm valor real. Enquanto
 * estiverem vazios, os blocos correspondentes simplesmente não renderizam,
 * em vez de mostrar placeholder no ar.
 */

// ── Produto próprio ──────────────────────────────────────────────────
export interface ProdutoProprio {
  id: string;
  nome: string;
  chamada: string;
  descricao: string;
  preco: string;
  /** PREENCHER: URL do checkout. Vazio = o bloco não aparece. */
  checkoutUrl: string;
  cta: string;
  /** Slugs de editoria onde este produto faz sentido. */
  categorias: string[];
}

export const produtos: ProdutoProprio[] = [
  {
    id: "eneagrama-do-dinheiro",
    nome: "Eneagrama do Dinheiro",
    chamada: "Você já sabe o que fazer com dinheiro. Então por que não faz?",
    descricao:
      "Um guia que mapeia os nove tipos do Eneagrama e mostra como cada um sabota — e destrava — a própria vida financeira.",
    preco: "R$ 37",
    checkoutUrl: "", // PREENCHER
    cta: "Descobrir meu tipo",
    categorias: ["dinheiro", "negocios", "saude-e-bem-estar"],
  },
];

export function produtoParaCategoria(categoriaSlug: string): ProdutoProprio | null {
  return produtos.find((p) => p.checkoutUrl && p.categorias.includes(categoriaSlug)) ?? null;
}

// ── Venda direta ─────────────────────────────────────────────────────
export interface FormatoComercial {
  nome: string;
  descricao: string;
  entrega: string;
}

export const formatosComerciais: FormatoComercial[] = [
  {
    nome: "Conteúdo patrocinado",
    descricao:
      "Matéria produzida pela nossa redação sobre o seu tema, com selo de publicidade visível e link para o seu site.",
    entrega: "Publicação permanente, com divulgação na newsletter",
  },
  {
    nome: "Cota de newsletter",
    descricao:
      "Sua marca em destaque na edição enviada para nossa base de inscritos, com espaço para texto, imagem e link.",
    entrega: "Por edição ou pacote mensal",
  },
  {
    nome: "Patrocínio de editoria",
    descricao:
      "Presença fixa em todas as matérias de uma editoria — sua marca associada a um assunto específico.",
    entrega: "Contrato mensal ou trimestral",
  },
  {
    nome: "Display",
    descricao: "Espaços de banner na home, nas matérias e nas páginas de editoria.",
    entrega: "Por período, com relatório de entrega",
  },
];

/**
 * Números do media kit. PREENCHER com dados reais do Analytics assim que
 * houver histórico — a seção fica oculta enquanto a lista estiver vazia.
 * Publicar audiência estimada sem medição é o tipo de coisa que queima
 * relação com anunciante na primeira renovação.
 */
export interface MetricaAudiencia {
  rotulo: string;
  valor: string;
  detalhe?: string;
}

export const metricasAudiencia: MetricaAudiencia[] = [];

export const perfilEditorial = [
  "Finanças pessoais e da família",
  "Comportamento e bem-estar",
  "Negócios e tecnologia",
];

/** PREENCHER: e-mail comercial que realmente recebe. */
export const emailComercial = "";

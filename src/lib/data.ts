import { supabase } from "./supabase";
import type { Database } from "@/integrations/supabase/types";

type CategoriaRow = Database["public"]["Tables"]["categorias"]["Row"];
type AutorRow = Database["public"]["Tables"]["autores"]["Row"];
type PerfilRow = Database["public"]["Tables"]["perfis"]["Row"];
type MateriaRow = Database["public"]["Tables"]["materias"]["Row"];

export interface FonteItem {
  titulo: string;
  url?: string;
}

export interface ResumoRapido {
  quem: string;
  oQue: string;
  quando: string;
  situacao: string;
  fontePrincipal: string;
}

// Keep the field names the existing UI components already expect
// (camelCase, matching the old demo-data.ts shape) so components
// like ArticleCard / Header / admin table don't need to change.

export interface Categoria {
  slug: string;
  nome: string;
  descricao: string;
  cor?: string;
}

export interface Autor {
  slug: string;
  nome: string;
  bio: string;
  cargo: string;
}

export interface Materia {
  id: string;
  slug: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  resumo: string;
  conteudo: string[];
  autor: string;
  status: MateriaRow["status"];
  publicadoEm: string;
  atualizadoEm?: string;
  tempoLeitura: number;
  imagem: string;
  legendaImagem: string;
  creditoImagem: string;
  classificacao: MateriaRow["classificacao"];
  destaque?: boolean;
  manchete?: boolean;
  visualizacoes: number;
  fontes: { titulo: string; url?: string }[];
  resumoRapido: ResumoRapido | null;
  taSabendoDisso?: string;
  tags: string[];
}

export interface Perfil {
  slug: string;
  nome: string;
  tipo: PerfilRow["tipo"];
  descricao: string;
  imagem: string;
  seguidores?: string;
  fatos: string[];
}

const mapCategoria = (r: CategoriaRow): Categoria => ({
  slug: r.slug,
  nome: r.nome,
  descricao: r.descricao,
  cor: r.cor ?? undefined,
});

const mapAutor = (r: AutorRow): Autor => ({
  slug: r.slug,
  nome: r.nome,
  bio: r.bio,
  cargo: r.cargo,
});

const mapPerfil = (r: PerfilRow): Perfil => ({
  slug: r.slug,
  nome: r.nome,
  tipo: r.tipo,
  descricao: r.descricao,
  imagem: r.imagem ?? "",
  seguidores: r.seguidores ?? undefined,
  fatos: r.fatos,
});

const mapMateria = (
  r: MateriaRow,
  categoriasBySlugId: Map<string, string>,
  autoresById: Map<string, string>,
): Materia => ({
  id: r.id,
  slug: r.slug,
  categoria: (r.categoria_id && categoriasBySlugId.get(r.categoria_id)) ?? "",
  titulo: r.titulo,
  subtitulo: r.subtitulo ?? "",
  resumo: r.resumo ?? "",
  conteudo: r.conteudo,
  autor: (r.autor_id && autoresById.get(r.autor_id)) ?? "",
  status: r.status,
  publicadoEm: r.publicado_em ?? r.created_at,
  atualizadoEm: r.atualizado_em ?? undefined,
  tempoLeitura: r.tempo_leitura,
  imagem: r.imagem ?? "",
  legendaImagem: r.legenda_imagem ?? "",
  creditoImagem: r.credito_imagem ?? "",
  classificacao: r.classificacao,
  destaque: r.destaque,
  manchete: r.manchete,
  visualizacoes: r.visualizacoes,
  fontes: (r.fontes as unknown as FonteItem[]) ?? [],
  resumoRapido: r.resumo_rapido as unknown as ResumoRapido | null,
  taSabendoDisso: r.ta_sabendo_disso ?? undefined,
  tags: r.tags,
});

export async function fetchCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase.from("categorias").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map(mapCategoria);
}

export async function fetchAutores(): Promise<Autor[]> {
  const { data, error } = await supabase.from("autores").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map(mapAutor);
}

export async function fetchPerfis(): Promise<Perfil[]> {
  const { data, error } = await supabase.from("perfis").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map(mapPerfil);
}

export async function fetchPerfilBySlug(slug: string): Promise<Perfil | null> {
  const { data, error } = await supabase.from("perfis").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapPerfil(data) : null;
}

// Fetches only published/updated matérias — used by public pages.
export async function fetchMaterias(): Promise<Materia[]> {
  const [{ data: categorias }, { data: autores }, { data: materias, error }] = await Promise.all([
    supabase.from("categorias").select("id, slug"),
    supabase.from("autores").select("id, slug"),
    supabase
      .from("materias")
      .select("*")
      .in("status", ["Publicada", "Atualizada"])
      .order("publicado_em", { ascending: false }),
  ]);
  if (error) throw error;

  const catMap = new Map((categorias ?? []).map((c) => [c.id, c.slug] as const));
  const autMap = new Map((autores ?? []).map((a) => [a.id, a.slug] as const));
  return (materias ?? []).map((m) => mapMateria(m, catMap, autMap));
}

// All matérias regardless of status — used by the admin panel.
export async function fetchAllMaterias(): Promise<Materia[]> {
  const [{ data: categorias }, { data: autores }, { data: materias, error }] = await Promise.all([
    supabase.from("categorias").select("id, slug"),
    supabase.from("autores").select("id, slug"),
    supabase.from("materias").select("*").order("updated_at", { ascending: false }),
  ]);
  if (error) throw error;

  const catMap = new Map((categorias ?? []).map((c) => [c.id, c.slug] as const));
  const autMap = new Map((autores ?? []).map((a) => [a.id, a.slug] as const));
  return (materias ?? []).map((m) => mapMateria(m, catMap, autMap));
}

export async function fetchMateriaBySlug(slug: string): Promise<Materia | null> {
  const [{ data: categorias }, { data: autores }, { data: m, error }] = await Promise.all([
    supabase.from("categorias").select("id, slug"),
    supabase.from("autores").select("id, slug"),
    supabase.from("materias").select("*").eq("slug", slug).maybeSingle(),
  ]);
  if (error) throw error;
  if (!m) return null;

  const catMap = new Map((categorias ?? []).map((c) => [c.id, c.slug] as const));
  const autMap = new Map((autores ?? []).map((a) => [a.id, a.slug] as const));
  return mapMateria(m, catMap, autMap);
}

export function getCategoria(categorias: Categoria[], slug: string) {
  return categorias.find((c) => c.slug === slug);
}
export function getAutor(autores: Autor[], slug: string) {
  return autores.find((a) => a.slug === slug);
}
export function materiasPorCategoria(materias: Materia[], slug: string) {
  return materias.filter((m) => m.categoria === slug);
}
export function ultimasMaterias(materias: Materia[], limit = 10) {
  return [...materias].sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm)).slice(0, limit);
}
export function maisLidas(materias: Materia[], limit = 5) {
  return [...materias].sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, limit);
}

export function formatarData(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

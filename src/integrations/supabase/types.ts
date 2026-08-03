export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author_name: string
          category: string
          content_markdown: string
          created_at: string
          excerpt: string | null
          faq: Json
          featured_image: string | null
          featured_image_alt: string | null
          id: string
          is_featured: boolean
          meta_description: string | null
          primary_keyword: string | null
          published_at: string | null
          secondary_keywords: Json
          seo_title: string | null
          slug: string
          status: string
          tags: Json
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category: string
          content_markdown: string
          created_at?: string
          excerpt?: string | null
          faq?: Json
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          primary_keyword?: string | null
          published_at?: string | null
          secondary_keywords?: Json
          seo_title?: string | null
          slug: string
          status?: string
          tags?: Json
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content_markdown?: string
          created_at?: string
          excerpt?: string | null
          faq?: Json
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          primary_keyword?: string | null
          published_at?: string | null
          secondary_keywords?: Json
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      autores: {
        Row: {
          bio: string
          cargo: string
          created_at: string
          id: string
          nome: string
          slug: string
          user_id: string | null
        }
        Insert: {
          bio?: string
          cargo?: string
          created_at?: string
          id?: string
          nome: string
          slug: string
          user_id?: string | null
        }
        Update: {
          bio?: string
          cargo?: string
          created_at?: string
          id?: string
          nome?: string
          slug?: string
          user_id?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          cor: string | null
          created_at: string
          descricao: string
          id: string
          nome: string
          slug: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          descricao?: string
          id?: string
          nome: string
          slug: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          descricao?: string
          id?: string
          nome?: string
          slug?: string
        }
        Relationships: []
      }
      materias: {
        Row: {
          atualizado_em: string | null
          autor_id: string | null
          categoria_id: string | null
          classificacao: string
          conteudo: string[]
          created_at: string
          created_by: string | null
          credito_imagem: string | null
          destaque: boolean
          fontes: Json
          id: string
          imagem: string | null
          legenda_imagem: string | null
          manchete: boolean
          publicado_em: string | null
          resumo: string | null
          resumo_rapido: Json | null
          slug: string
          status: string
          subtitulo: string | null
          ta_sabendo_disso: string | null
          tags: string[]
          tempo_leitura: number
          titulo: string
          updated_at: string
          visualizacoes: number
        }
        Insert: {
          atualizado_em?: string | null
          autor_id?: string | null
          categoria_id?: string | null
          classificacao?: string
          conteudo?: string[]
          created_at?: string
          created_by?: string | null
          credito_imagem?: string | null
          destaque?: boolean
          fontes?: Json
          id?: string
          imagem?: string | null
          legenda_imagem?: string | null
          manchete?: boolean
          publicado_em?: string | null
          resumo?: string | null
          resumo_rapido?: Json | null
          slug: string
          status?: string
          subtitulo?: string | null
          ta_sabendo_disso?: string | null
          tags?: string[]
          tempo_leitura?: number
          titulo: string
          updated_at?: string
          visualizacoes?: number
        }
        Update: {
          atualizado_em?: string | null
          autor_id?: string | null
          categoria_id?: string | null
          classificacao?: string
          conteudo?: string[]
          created_at?: string
          created_by?: string | null
          credito_imagem?: string | null
          destaque?: boolean
          fontes?: Json
          id?: string
          imagem?: string | null
          legenda_imagem?: string | null
          manchete?: boolean
          publicado_em?: string | null
          resumo?: string | null
          resumo_rapido?: Json | null
          slug?: string
          status?: string
          subtitulo?: string | null
          ta_sabendo_disso?: string | null
          tags?: string[]
          tempo_leitura?: number
          titulo?: string
          updated_at?: string
          visualizacoes?: number
        }
        Relationships: [
          {
            foreignKeyName: "materias_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "autores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_inscricoes: {
        Row: {
          cancelado_em: string | null
          confirmado_em: string | null
          consentimento: boolean
          created_at: string
          email: string
          id: string
          origem: string | null
        }
        Insert: {
          cancelado_em?: string | null
          confirmado_em?: string | null
          consentimento?: boolean
          created_at?: string
          email: string
          id?: string
          origem?: string | null
        }
        Update: {
          cancelado_em?: string | null
          confirmado_em?: string | null
          consentimento?: boolean
          created_at?: string
          email?: string
          id?: string
          origem?: string | null
        }
        Relationships: []
      }
      perfis: {
        Row: {
          created_at: string
          descricao: string
          fatos: string[]
          id: string
          imagem: string | null
          nome: string
          seguidores: string | null
          slug: string
          tipo: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          fatos?: string[]
          id?: string
          imagem?: string | null
          nome: string
          seguidores?: string | null
          slug: string
          tipo: string
        }
        Update: {
          created_at?: string
          descricao?: string
          fatos?: string[]
          id?: string
          imagem?: string | null
          nome?: string
          seguidores?: string | null
          slug?: string
          tipo?: string
        }
        Relationships: []
      }
      platform_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_platform_editor: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

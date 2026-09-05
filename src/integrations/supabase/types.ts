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
      ai_recommendations: {
        Row: {
          created_at: string
          id: string
          kind: string
          payload: Json
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          payload: Json
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          payload?: Json
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      code_sessions: {
        Row: {
          created_at: string
          id: string
          language: string | null
          mode: string
          project_id: string
          prompt: string
          result: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          mode?: string
          project_id: string
          prompt?: string
          result?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          mode?: string
          project_id?: string
          prompt?: string
          result?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_weeks: number
          branch: string | null
          budget: string | null
          career_goal: string | null
          college: string | null
          created_at: string
          daily_hours: number
          degree: string | null
          experience_level: string | null
          full_name: string
          hardware: string | null
          id: string
          interests: string[]
          onboarded: boolean
          semester: string | null
          skills: string[]
          team_size: number
          updated_at: string
        }
        Insert: {
          available_weeks?: number
          branch?: string | null
          budget?: string | null
          career_goal?: string | null
          college?: string | null
          created_at?: string
          daily_hours?: number
          degree?: string | null
          experience_level?: string | null
          full_name?: string
          hardware?: string | null
          id: string
          interests?: string[]
          onboarded?: boolean
          semester?: string | null
          skills?: string[]
          team_size?: number
          updated_at?: string
        }
        Update: {
          available_weeks?: number
          branch?: string | null
          budget?: string | null
          career_goal?: string | null
          college?: string | null
          created_at?: string
          daily_hours?: number
          degree?: string | null
          experience_level?: string | null
          full_name?: string
          hardware?: string | null
          id?: string
          interests?: string[]
          onboarded?: boolean
          semester?: string | null
          skills?: string[]
          team_size?: number
          updated_at?: string
        }
        Relationships: []
      }
      project_features: {
        Row: {
          accepted: boolean
          complexity: string | null
          created_at: string
          dependencies: string[]
          description: string | null
          effort: string | null
          id: string
          name: string
          priority: string | null
          project_id: string
          tier: string
          user_id: string
        }
        Insert: {
          accepted?: boolean
          complexity?: string | null
          created_at?: string
          dependencies?: string[]
          description?: string | null
          effort?: string | null
          id?: string
          name: string
          priority?: string | null
          project_id: string
          tier?: string
          user_id: string
        }
        Update: {
          accepted?: boolean
          complexity?: string | null
          created_at?: string
          dependencies?: string[]
          description?: string | null
          effort?: string | null
          id?: string
          name?: string
          priority?: string | null
          project_id?: string
          tier?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_features_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_ideas: {
        Row: {
          created_at: string
          id: string
          payload: Json
          saved: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          saved?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          saved?: boolean
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          current_phase: string | null
          deadline: string | null
          difficulty: string | null
          domain: string | null
          duration: string | null
          evaluation: Json | null
          id: string
          is_active: boolean
          problem_statement: string | null
          solution: string | null
          tech_stack: Json | null
          technologies: string[]
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_phase?: string | null
          deadline?: string | null
          difficulty?: string | null
          domain?: string | null
          duration?: string | null
          evaluation?: Json | null
          id?: string
          is_active?: boolean
          problem_statement?: string | null
          solution?: string | null
          tech_stack?: Json | null
          technologies?: string[]
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_phase?: string | null
          deadline?: string | null
          difficulty?: string | null
          domain?: string | null
          duration?: string | null
          evaluation?: Json | null
          id?: string
          is_active?: boolean
          problem_statement?: string | null
          solution?: string | null
          tech_stack?: Json | null
          technologies?: string[]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmap_phases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          dependencies: string[]
          description: string | null
          due_date: string | null
          effort: string | null
          id: string
          order_index: number
          phase_id: string | null
          priority: string
          project_id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dependencies?: string[]
          description?: string | null
          due_date?: string | null
          effort?: string | null
          id?: string
          order_index?: number
          phase_id?: string | null
          priority?: string
          project_id: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          dependencies?: string[]
          description?: string | null
          due_date?: string | null
          effort?: string | null
          id?: string
          order_index?: number
          phase_id?: string | null
          priority?: string
          project_id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "roadmap_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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

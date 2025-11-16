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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      group_members: {
        Row: {
          group_id: string
          joined_at: string | null
          student_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string | null
          student_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_mentors: {
        Row: {
          group_id: string
          mentor_id: string
        }
        Insert: {
          group_id: string
          mentor_id: string
        }
        Update: {
          group_id?: string
          mentor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_mentors_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          semester: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          semester?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          semester?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          file_url: string | null
          group_id: string | null
          id: string
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          file_url?: string | null
          group_id?: string | null
          id?: string
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          file_url?: string | null
          group_id?: string | null
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          file_url: string | null
          group_id: string | null
          id: string
          is_pinned: boolean | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          file_url?: string | null
          group_id?: string | null
          id?: string
          is_pinned?: boolean | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          file_url?: string | null
          group_id?: string | null
          id?: string
          is_pinned?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notices_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          semester: number | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          semester?: number | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          semester?: number | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          feedback: string | null
          file_url: string
          grade: number | null
          group_id: string | null
          id: string
          rubric: Json | null
          student_id: string | null
          student_name: string | null
          submitted_at: string | null
          task_id: string | null
        }
        Insert: {
          feedback?: string | null
          file_url: string
          grade?: number | null
          group_id?: string | null
          id?: string
          rubric?: Json | null
          student_id?: string | null
          student_name?: string | null
          submitted_at?: string | null
          task_id?: string | null
        }
        Update: {
          feedback?: string | null
          file_url?: string
          grade?: number | null
          group_id?: string | null
          id?: string
          rubric?: Json | null
          student_id?: string | null
          student_name?: string | null
          submitted_at?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignees: {
        Row: {
          student_id: string
          task_id: string
        }
        Insert: {
          student_id: string
          task_id: string
        }
        Update: {
          student_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          file_urls: string[] | null
          group_id: string | null
          id: string
          semester: number | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          file_urls?: string[] | null
          group_id?: string | null
          id?: string
          semester?: number | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          file_urls?: string[] | null
          group_id?: string | null
          id?: string
          semester?: number | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "mentor" | "admin"
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
    Enums: {
      app_role: ["student", "mentor", "admin"],
    },
  },
} as const

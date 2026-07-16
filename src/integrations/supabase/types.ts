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
      availability_exceptions: {
        Row: {
          blocked: boolean
          created_at: string
          end_time: string | null
          exception_date: string
          id: string
          note: string | null
          start_time: string | null
        }
        Insert: {
          blocked?: boolean
          created_at?: string
          end_time?: string | null
          exception_date: string
          id?: string
          note?: string | null
          start_time?: string | null
        }
        Update: {
          blocked?: boolean
          created_at?: string
          end_time?: string | null
          exception_date?: string
          id?: string
          note?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      credit_lots: {
        Row: {
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          note: string | null
          purchase_id: string | null
          reserved_for_lesson_id: string | null
          source: string
          status: Database["public"]["Enums"]["credit_lot_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          note?: string | null
          purchase_id?: string | null
          reserved_for_lesson_id?: string | null
          source?: string
          status?: Database["public"]["Enums"]["credit_lot_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          note?: string | null
          purchase_id?: string | null
          reserved_for_lesson_id?: string | null
          source?: string
          status?: Database["public"]["Enums"]["credit_lot_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_lots_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "credit_purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_lots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_credit_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_purchases: {
        Row: {
          amount_jpy: number
          created_at: string
          credits: number
          expiry_days: number
          id: string
          package_code: Database["public"]["Enums"]["credit_package_code"]
          paid_at: string | null
          status: Database["public"]["Enums"]["purchase_status"]
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_jpy: number
          created_at?: string
          credits: number
          expiry_days: number
          id?: string
          package_code: Database["public"]["Enums"]["credit_package_code"]
          paid_at?: string | null
          status?: Database["public"]["Enums"]["purchase_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_jpy?: number
          created_at?: string
          credits?: number
          expiry_days?: number
          id?: string
          package_code?: Database["public"]["Enums"]["credit_package_code"]
          paid_at?: string | null
          status?: Database["public"]["Enums"]["purchase_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_credit_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          lesson_id: string | null
          note: string | null
          stripe_session_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          lesson_id?: string | null
          note?: string | null
          stripe_session_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          lesson_id?: string | null
          note?: string | null
          stripe_session_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_credit_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "credit_tx_lesson_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lesson_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_messages_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "v_user_credit_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lessons: {
        Row: {
          cancelled_at: string | null
          cancelled_by: Database["public"]["Enums"]["cancelled_by_actor"] | null
          created_at: string
          duration_min: number
          feedback: string | null
          id: string
          meet_url: string | null
          mode: Database["public"]["Enums"]["game_mode"]
          scheduled_at: string
          status: Database["public"]["Enums"]["lesson_status"]
          student_id: string
          updated_at: string
          vocabulary_notes: string | null
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_by?:
            | Database["public"]["Enums"]["cancelled_by_actor"]
            | null
          created_at?: string
          duration_min?: number
          feedback?: string | null
          id?: string
          meet_url?: string | null
          mode: Database["public"]["Enums"]["game_mode"]
          scheduled_at: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_id: string
          updated_at?: string
          vocabulary_notes?: string | null
        }
        Update: {
          cancelled_at?: string | null
          cancelled_by?:
            | Database["public"]["Enums"]["cancelled_by_actor"]
            | null
          created_at?: string
          duration_min?: number
          feedback?: string | null
          id?: string
          meet_url?: string | null
          mode?: Database["public"]["Enums"]["game_mode"]
          scheduled_at?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_id?: string
          updated_at?: string
          vocabulary_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_user_credit_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          english_level: Database["public"]["Enums"]["english_level"] | null
          fortnite_nickname: string | null
          games: string[]
          id: string
          minecraft_gamertag: string | null
          name: string
          preferred_game: Database["public"]["Enums"]["game_mode"] | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          english_level?: Database["public"]["Enums"]["english_level"] | null
          fortnite_nickname?: string | null
          games?: string[]
          id: string
          minecraft_gamertag?: string | null
          name?: string
          preferred_game?: Database["public"]["Enums"]["game_mode"] | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          english_level?: Database["public"]["Enums"]["english_level"] | null
          fortnite_nickname?: string | null
          games?: string[]
          id?: string
          minecraft_gamertag?: string | null
          name?: string
          preferred_game?: Database["public"]["Enums"]["game_mode"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_user_credit_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      teacher_availability: {
        Row: {
          active: boolean
          created_at: string
          end_time: string
          id: string
          start_time: string
          updated_at: string
          weekday: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
          weekday: number
        }
        Update: {
          active?: boolean
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_credit_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      v_user_credit_summary: {
        Row: {
          available: number | null
          next_expiration: string | null
          reserved: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      consume_credit_lot: { Args: { _lesson_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      release_credit_lot: {
        Args: { _extend_days?: number; _lesson_id: string }
        Returns: string
      }
      reserve_credit_lot: {
        Args: { _lesson_id: string; _user_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "student" | "teacher"
      cancelled_by_actor: "student" | "teacher" | "system"
      credit_lot_status:
        | "available"
        | "reserved"
        | "consumed"
        | "expired"
        | "refunded"
      credit_package_code: "single" | "pack5" | "pack10"
      english_level: "beginner" | "intermediate" | "advanced"
      game_mode: "minecraft" | "fortnite"
      lesson_status:
        | "scheduled"
        | "completed"
        | "student_cancelled"
        | "late_cancel"
        | "no_show"
        | "teacher_cancelled"
      purchase_status: "pending" | "paid" | "refunded" | "failed"
      transaction_type:
        | "purchase"
        | "deduction"
        | "refund"
        | "consumption"
        | "expiration"
        | "extension"
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
      app_role: ["admin", "student", "teacher"],
      cancelled_by_actor: ["student", "teacher", "system"],
      credit_lot_status: [
        "available",
        "reserved",
        "consumed",
        "expired",
        "refunded",
      ],
      credit_package_code: ["single", "pack5", "pack10"],
      english_level: ["beginner", "intermediate", "advanced"],
      game_mode: ["minecraft", "fortnite"],
      lesson_status: [
        "scheduled",
        "completed",
        "student_cancelled",
        "late_cancel",
        "no_show",
        "teacher_cancelled",
      ],
      purchase_status: ["pending", "paid", "refunded", "failed"],
      transaction_type: [
        "purchase",
        "deduction",
        "refund",
        "consumption",
        "expiration",
        "extension",
      ],
    },
  },
} as const

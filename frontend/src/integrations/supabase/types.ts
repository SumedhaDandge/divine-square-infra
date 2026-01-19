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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      layouts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          layout_image_url: string | null
          name: string
          project_id: string
          total_plots: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          layout_image_url?: string | null
          name: string
          project_id: string
          total_plots?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          layout_image_url?: string | null
          name?: string
          project_id?: string
          total_plots?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "layouts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          project_interest: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          project_interest?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          project_interest?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_project_interest_fkey"
            columns: ["project_interest"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      plots: {
        Row: {
          area_sqft: number
          booked_at: string | null
          booked_by: string | null
          corner_plot: boolean | null
          created_at: string
          dimensions: string | null
          facing: string | null
          height: number | null
          id: string
          layout_id: string
          plot_number: string
          position_x: number | null
          position_y: number | null
          price_per_sqft: number
          sold_at: string | null
          status: Database["public"]["Enums"]["plot_status"]
          total_price: number
          updated_at: string
          width: number | null
        }
        Insert: {
          area_sqft: number
          booked_at?: string | null
          booked_by?: string | null
          corner_plot?: boolean | null
          created_at?: string
          dimensions?: string | null
          facing?: string | null
          height?: number | null
          id?: string
          layout_id: string
          plot_number: string
          position_x?: number | null
          position_y?: number | null
          price_per_sqft: number
          sold_at?: string | null
          status?: Database["public"]["Enums"]["plot_status"]
          total_price: number
          updated_at?: string
          width?: number | null
        }
        Update: {
          area_sqft?: number
          booked_at?: string | null
          booked_by?: string | null
          corner_plot?: boolean | null
          created_at?: string
          dimensions?: string | null
          facing?: string | null
          height?: number | null
          id?: string
          layout_id?: string
          plot_number?: string
          position_x?: number | null
          position_y?: number | null
          price_per_sqft?: number
          sold_at?: string | null
          status?: Database["public"]["Enums"]["plot_status"]
          total_price?: number
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plots_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          amenities: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          price_range_max: number | null
          price_range_min: number | null
          status: string
          total_plots: number
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          price_range_max?: number | null
          price_range_min?: number | null
          status?: string
          total_plots?: number
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          price_range_max?: number | null
          price_range_min?: number | null
          status?: string
          total_plots?: number
          updated_at?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          base_price: number
          created_at: string
          created_by: string
          discount_amount: number | null
          discount_percentage: number | null
          final_price: number
          id: string
          lead_id: string
          plot_id: string
          status: string
          terms: string | null
          updated_at: string
          valid_until: string
        }
        Insert: {
          base_price: number
          created_at?: string
          created_by: string
          discount_amount?: number | null
          discount_percentage?: number | null
          final_price: number
          id?: string
          lead_id: string
          plot_id: string
          status?: string
          terms?: string | null
          updated_at?: string
          valid_until: string
        }
        Update: {
          base_price?: number
          created_at?: string
          created_by?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          final_price?: number
          id?: string
          lead_id?: string
          plot_id?: string
          status?: string
          terms?: string | null
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          conducted_by: string
          created_at: string
          feedback_interest_level: string | null
          feedback_notes: string | null
          feedback_rating: number | null
          id: string
          lead_id: string
          notes: string | null
          pickup_location: string | null
          project_id: string
          scheduled_date: string
          scheduled_time: string
          status: Database["public"]["Enums"]["site_visit_status"]
          updated_at: string
        }
        Insert: {
          conducted_by: string
          created_at?: string
          feedback_interest_level?: string | null
          feedback_notes?: string | null
          feedback_rating?: number | null
          id?: string
          lead_id: string
          notes?: string | null
          pickup_location?: string | null
          project_id: string
          scheduled_date: string
          scheduled_time: string
          status?: Database["public"]["Enums"]["site_visit_status"]
          updated_at?: string
        }
        Update: {
          conducted_by?: string
          created_at?: string
          feedback_interest_level?: string | null
          feedback_notes?: string | null
          feedback_rating?: number | null
          id?: string
          lead_id?: string
          notes?: string | null
          pickup_location?: string | null
          project_id?: string
          scheduled_date?: string
          scheduled_time?: string
          status?: Database["public"]["Enums"]["site_visit_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_visits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string
          completed: boolean
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          lead_id: string
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
        }
        Insert: {
          assigned_to: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date: string
          id?: string
          lead_id: string
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string
          id?: string
          lead_id?: string
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "executive"
      lead_source:
        | "facebook"
        | "instagram"
        | "google"
        | "referral"
        | "walk_in"
        | "website"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "negotiation"
        | "won"
        | "lost"
      plot_status: "available" | "booked" | "sold"
      site_visit_status: "scheduled" | "completed" | "cancelled" | "no_show"
      task_type:
        | "call"
        | "whatsapp"
        | "site_visit"
        | "reminder"
        | "email"
        | "meeting"
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
      app_role: ["admin", "manager", "executive"],
      lead_source: [
        "facebook",
        "instagram",
        "google",
        "referral",
        "walk_in",
        "website",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "negotiation",
        "won",
        "lost",
      ],
      plot_status: ["available", "booked", "sold"],
      site_visit_status: ["scheduled", "completed", "cancelled", "no_show"],
      task_type: [
        "call",
        "whatsapp",
        "site_visit",
        "reminder",
        "email",
        "meeting",
      ],
    },
  },
} as const

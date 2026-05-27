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
      appointment_status_history: {
        Row: {
          appointment_id: string
          changed_by: string | null
          created_at: string
          id: string
          new_status: string
          old_status: string | null
          reason: string | null
        }
        Insert: {
          appointment_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status: string
          old_status?: string | null
          reason?: string | null
        }
        Update: {
          appointment_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status?: string
          old_status?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_status_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          after_photo_url: string | null
          before_photo_url: string | null
          client_id: string | null
          created_at: string
          dog_id: string | null
          duration_minutes: number
          groomer_notes: string | null
          guest_dog_breed: string | null
          guest_dog_name: string | null
          guest_dog_neutered: boolean | null
          guest_dog_sex: string | null
          guest_dog_size: string | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          notes_admin: string | null
          notes_client: string | null
          price_charged_usd: number | null
          reminder_24h_sent: boolean
          reminder_2h_sent: boolean
          scheduled_date: string
          scheduled_time: string
          service_id: string
          status: string
          updated_at: string
        }
        Insert: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          client_id?: string | null
          created_at?: string
          dog_id?: string | null
          duration_minutes: number
          groomer_notes?: string | null
          guest_dog_breed?: string | null
          guest_dog_name?: string | null
          guest_dog_neutered?: boolean | null
          guest_dog_sex?: string | null
          guest_dog_size?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          notes_admin?: string | null
          notes_client?: string | null
          price_charged_usd?: number | null
          reminder_24h_sent?: boolean
          reminder_2h_sent?: boolean
          scheduled_date: string
          scheduled_time: string
          service_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          client_id?: string | null
          created_at?: string
          dog_id?: string | null
          duration_minutes?: number
          groomer_notes?: string | null
          guest_dog_breed?: string | null
          guest_dog_name?: string | null
          guest_dog_neutered?: boolean | null
          guest_dog_sex?: string | null
          guest_dog_size?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          notes_admin?: string | null
          notes_client?: string | null
          price_charged_usd?: number | null
          reminder_24h_sent?: boolean
          reminder_2h_sent?: boolean
          scheduled_date?: string
          scheduled_time?: string
          service_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_dates: {
        Row: {
          created_at: string
          date: string
          id: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      business_schedules: {
        Row: {
          close_time: string | null
          day_of_week: number
          id: string
          is_open: boolean
          max_concurrent_appointments: number
          open_time: string | null
        }
        Insert: {
          close_time?: string | null
          day_of_week: number
          id?: string
          is_open?: boolean
          max_concurrent_appointments?: number
          open_time?: string | null
        }
        Update: {
          close_time?: string | null
          day_of_week?: number
          id?: string
          is_open?: boolean
          max_concurrent_appointments?: number
          open_time?: string | null
        }
        Relationships: []
      }
      dogs: {
        Row: {
          allergies: string | null
          behavior_notes: string | null
          breed: string | null
          color: string | null
          created_at: string
          date_of_birth: string | null
          id: string
          is_active: boolean
          is_dog_friendly: boolean
          is_human_friendly: boolean
          is_neutered: boolean | null
          medical_notes: string | null
          name: string
          owner_id: string
          photo_url: string | null
          sex: string | null
          size: string | null
          updated_at: string
          vaccination_bordetella_date: string | null
          vaccination_dhpp_date: string | null
          vaccination_rabies_date: string | null
          vet_name: string | null
          vet_phone: string | null
          weight_lbs: number | null
        }
        Insert: {
          allergies?: string | null
          behavior_notes?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_active?: boolean
          is_dog_friendly?: boolean
          is_human_friendly?: boolean
          is_neutered?: boolean | null
          medical_notes?: string | null
          name: string
          owner_id: string
          photo_url?: string | null
          sex?: string | null
          size?: string | null
          updated_at?: string
          vaccination_bordetella_date?: string | null
          vaccination_dhpp_date?: string | null
          vaccination_rabies_date?: string | null
          vet_name?: string | null
          vet_phone?: string | null
          weight_lbs?: number | null
        }
        Update: {
          allergies?: string | null
          behavior_notes?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_active?: boolean
          is_dog_friendly?: boolean
          is_human_friendly?: boolean
          is_neutered?: boolean | null
          medical_notes?: string | null
          name?: string
          owner_id?: string
          photo_url?: string | null
          sex?: string | null
          size?: string | null
          updated_at?: string
          vaccination_bordetella_date?: string | null
          vaccination_dhpp_date?: string | null
          vaccination_rabies_date?: string | null
          vet_name?: string | null
          vet_phone?: string | null
          weight_lbs?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dogs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          photo_url: string
          sort_order: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          photo_url: string
          sort_order?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          photo_url?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          price_large: number | null
          price_medium: number | null
          price_small: number | null
          price_xl: number | null
          price_xs: number | null
          price_xxl: number | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean
          name: string
          price_large?: number | null
          price_medium?: number | null
          price_small?: number | null
          price_xl?: number | null
          price_xs?: number | null
          price_xxl?: number | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          price_large?: number | null
          price_medium?: number | null
          price_small?: number | null
          price_xl?: number | null
          price_xs?: number | null
          price_xxl?: number | null
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
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

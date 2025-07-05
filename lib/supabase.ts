import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          city: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          message: string
          user_avatar: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message: string
          user_avatar?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message?: string
          user_avatar?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          amenities: string[] | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          owner_id: string
          price_per_night: number
          rating: number | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          owner_id: string
          price_per_night: number
          rating?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string
          price_per_night?: number
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotels_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          destination: string
          end_date: string
          id: string
          name: string
          owner_id: string
          start_date: string
          start_location: string
          transport_mode: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          destination: string
          end_date: string
          id?: string
          name: string
          owner_id: string
          start_date: string
          start_location: string
          transport_mode?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          destination?: string
          end_date?: string
          id?: string
          name?: string
          owner_id?: string
          start_date?: string
          start_location?: string
          transport_mode?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_posts: {
        Row: {
          city: string
          comments: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          latitude: number | null
          likes: number
          longitude: number | null
          title: string
          user_avatar: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          city: string
          comments?: number
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          likes?: number
          longitude?: number | null
          title: string
          user_avatar?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          city?: string
          comments?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          likes?: number
          longitude?: number | null
          title?: string
          user_avatar?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
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

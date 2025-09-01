export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: string | null
          profile_image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: 'admin' | 'staff' | 'manager'
          permissions: string[] | null
          department: string | null
          profile_image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role: 'admin' | 'staff' | 'manager'
          permissions?: string[] | null
          department?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: 'admin' | 'staff' | 'manager'
          permissions?: string[] | null
          department?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'terrain' | 'maison' | 'appartement' | 'studio' | 'chambre' | 'lot' | 'commercial'
          location: string | null
          city: string | null
          area_sqm: number | null
          status: 'disponible' | 'réservé' | 'vendu'
          price: number
          presentation_video_url: string | null
          latitude: number | null
          longitude: number | null
          features: string[] | null
          images: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'terrain' | 'maison' | 'appartement' | 'studio' | 'chambre' | 'lot' | 'commercial'
          location?: string | null
          city?: string | null
          area_sqm?: number | null
          status?: 'disponible' | 'réservé' | 'vendu'
          price: number
          presentation_video_url?: string | null
          latitude?: number | null
          longitude?: number | null
          features?: string[] | null
          images?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'terrain' | 'maison' | 'appartement' | 'studio' | 'chambre' | 'lot' | 'commercial'
          location?: string | null
          city?: string | null
          area_sqm?: number | null
          status?: 'disponible' | 'réservé' | 'vendu'
          price?: number
          presentation_video_url?: string | null
          latitude?: number | null
          longitude?: number | null
          features?: string[] | null
          images?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          property_id: string
          transaction_type: 'achat' | 'réservation'
          total_amount: number
          amount_paid: number
          amount_remaining: number
          status: 'en attente' | 'en cours' | 'completé' | 'annulé'
          installments_allowed: boolean
          number_of_installments: number
          next_payment_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          transaction_type: 'achat' | 'réservation'
          total_amount: number
          amount_paid?: number
          status?: 'en attente' | 'en cours' | 'completé' | 'annulé'
          installments_allowed?: boolean
          number_of_installments?: number
          next_payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          transaction_type?: 'achat' | 'réservation'
          total_amount?: number
          amount_paid?: number
          status?: 'en attente' | 'en cours' | 'completé' | 'annulé'
          installments_allowed?: boolean
          number_of_installments?: number
          next_payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          transaction_id: string
          amount: number
          payment_method: string
          payment_date: string
          reference_number: string | null
          status: 'réussi' | 'échoué' | 'en attente'
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          amount: number
          payment_method: string
          payment_date?: string
          reference_number?: string | null
          status?: 'réussi' | 'échoué' | 'en attente'
          created_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          amount?: number
          payment_method?: string
          payment_date?: string
          reference_number?: string | null
          status?: 'réussi' | 'échoué' | 'en attente'
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
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
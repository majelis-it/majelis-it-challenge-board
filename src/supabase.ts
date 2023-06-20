export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attempts: {
        Row: {
          id: number
          score_board_id: number | null
          scores: Json | null
          submitted_at: string | null
          test_output: string | null
        }
        Insert: {
          id?: number
          score_board_id?: number | null
          scores?: Json | null
          submitted_at?: string | null
          test_output?: string | null
        }
        Update: {
          id?: number
          score_board_id?: number | null
          scores?: Json | null
          submitted_at?: string | null
          test_output?: string | null
        }
        Relationships: []
      }
      challenge: {
        Row: {
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      score_board: {
        Row: {
          challenge_id: number | null
          github_repository: string | null
          githun_username: string | null
          id: number
          scores: Json | null
        }
        Insert: {
          challenge_id?: number | null
          github_repository?: string | null
          githun_username?: string | null
          id?: number
          scores?: Json | null
        }
        Update: {
          challenge_id?: number | null
          github_repository?: string | null
          githun_username?: string | null
          id?: number
          scores?: Json | null
        }
        Relationships: []
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

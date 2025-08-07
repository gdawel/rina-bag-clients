import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up Supabase connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          cpf: string;
          nomeCompleto: string;
          telefone: string;
          email: string;
          cep: string;
          logradouro: string;
          numero: string;
          complemento: string | null;
          bairro: string;
          cidade: string;
          estado: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cpf: string;
          nomeCompleto: string;
          telefone: string;
          email: string;
          cep: string;
          logradouro: string;
          numero: string;
          complemento?: string | null;
          bairro: string;
          cidade: string;
          estado: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cpf?: string;
          nomeCompleto?: string;
          telefone?: string;
          email?: string;
          cep?: string;
          logradouro?: string;
          numero?: string;
          complemento?: string | null;
          bairro?: string;
          cidade?: string;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
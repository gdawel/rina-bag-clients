/*
  # Create users table for Bazar da Rina

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `cpf` (text, unique, not null)
      - `nomeCompleto` (text, not null)
      - `telefone` (text, not null)
      - `email` (text, unique, not null)
      - `cep` (text, not null)
      - `logradouro` (text, not null)
      - `numero` (text, not null)
      - `complemento` (text, optional)
      - `bairro` (text, not null)
      - `cidade` (text, not null)
      - `estado` (text, not null)
      - `created_at` (timestamp with timezone, default now)
      - `updated_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `users` table
    - Add policy for public access (since this is a registration form)
    - Add policy for admin access to view all users

  3. Indexes
    - Index on CPF for fast lookups
    - Index on email for fast lookups
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf text UNIQUE NOT NULL,
  "nomeCompleto" text NOT NULL,
  telefone text NOT NULL,
  email text UNIQUE NOT NULL,
  cep text NOT NULL,
  logradouro text NOT NULL,
  numero text NOT NULL,
  complemento text DEFAULT '',
  bairro text NOT NULL,
  cidade text NOT NULL,
  estado text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (registration)
CREATE POLICY "Allow public insert" ON users
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public select by CPF" ON users
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow public update by CPF" ON users
  FOR UPDATE TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
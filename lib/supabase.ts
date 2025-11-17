import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Company {
  id: string
  name: string
  siret?: string
  address?: string
  email?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  company_id: string
  numero: string
  intitule: string
  type: 'ACTIF' | 'PASSIF' | 'CHARGE' | 'PRODUIT'
  created_at: string
}

export interface Journal {
  id: string
  company_id: string
  code: string
  intitule: string
  type: 'ACHAT' | 'VENTE' | 'BANQUE' | 'CAISSE' | 'OD'
  created_at: string
}

export interface JournalEntry {
  id: string
  company_id: string
  batch_id: string
  journal_code: string
  compte: string
  s: 'D' | 'C'
  montant: number
  libelle: string
  date_ecriture: string
  status: 'draft' | 'posted'
  letter_code?: string
  created_at: string
  updated_at: string
}

export interface CompanySettings {
  id: string
  company_id: string
  fiscal_year_start: string
  fiscal_year_end: string
  vat_regime?: string
  accounting_plan?: string
  created_at: string
  updated_at: string
}

-- ============================================
-- Script de création de la base de données
-- Comptabilité AS400 - TAC Hockey
-- ============================================

-- Suppression des tables existantes (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS regles CASCADE;
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS journal_accounts CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS journals CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- ============================================
-- 1. Table COMPANIES
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  siret TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_companies_name ON companies(name);

-- RLS (Row Level Security)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire
CREATE POLICY "Allow public read access" ON companies
  FOR SELECT USING (true);

-- Politique : Tout le monde peut créer (pour l'instant, à sécuriser plus tard)
CREATE POLICY "Allow public insert" ON companies
  FOR INSERT WITH CHECK (true);

-- Politique : Tout le monde peut modifier
CREATE POLICY "Allow public update" ON companies
  FOR UPDATE USING (true);

-- ============================================
-- 2. Table COMPANY_SETTINGS
-- ============================================
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  fiscal_year_start DATE NOT NULL,
  fiscal_year_end DATE NOT NULL,
  vat_regime TEXT DEFAULT 'NORMAL',
  accounting_plan TEXT DEFAULT 'PCG',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

-- Index
CREATE INDEX idx_company_settings_company ON company_settings(company_id);

-- RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON company_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON company_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON company_settings
  FOR UPDATE USING (true);

-- ============================================
-- 3. Table JOURNALS
-- ============================================
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  intitule TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ACHAT', 'VENTE', 'BANQUE', 'CAISSE', 'OD')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, code)
);

-- Index
CREATE INDEX idx_journals_company ON journals(company_id);
CREATE INDEX idx_journals_code ON journals(code);

-- RLS
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON journals
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON journals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON journals
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON journals
  FOR DELETE USING (true);

-- ============================================
-- 4. Table ACCOUNTS
-- ============================================
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  numero TEXT NOT NULL,
  intitule TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ACTIF', 'PASSIF', 'CHARGE', 'PRODUIT')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, numero)
);

-- Index
CREATE INDEX idx_accounts_company ON accounts(company_id);
CREATE INDEX idx_accounts_numero ON accounts(numero);
CREATE INDEX idx_accounts_type ON accounts(type);

-- RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON accounts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON accounts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON accounts
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON accounts
  FOR DELETE USING (true);

-- ============================================
-- 5. Table JOURNAL_ENTRIES
-- ============================================
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL,
  journal_code TEXT NOT NULL,
  compte TEXT NOT NULL,
  s TEXT NOT NULL CHECK (s IN ('D', 'C')),
  montant DECIMAL(15, 2) NOT NULL,
  libelle TEXT NOT NULL,
  date_ecriture DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'posted')),
  letter_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_journal_entries_company ON journal_entries(company_id);
CREATE INDEX idx_journal_entries_batch ON journal_entries(batch_id);
CREATE INDEX idx_journal_entries_compte ON journal_entries(compte);
CREATE INDEX idx_journal_entries_date ON journal_entries(date_ecriture);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
CREATE INDEX idx_journal_entries_letter ON journal_entries(letter_code);

-- RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON journal_entries
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON journal_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON journal_entries
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON journal_entries
  FOR DELETE USING (true);

-- ============================================
-- 6. Table JOURNAL_ACCOUNTS (optionnelle, pour la structure)
-- ============================================
CREATE TABLE journal_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(journal_id, account_id)
);

-- RLS
ALTER TABLE journal_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON journal_accounts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON journal_accounts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete" ON journal_accounts
  FOR DELETE USING (true);

-- ============================================
-- 7. Table REGLES (optionnelle, pour l'IA)
-- ============================================
CREATE TABLE regles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT,
  condition_json JSONB,
  action_json JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_regles_company ON regles(company_id);
CREATE INDEX idx_regles_active ON regles(active);

-- RLS
ALTER TABLE regles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON regles
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON regles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON regles
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON regles
  FOR DELETE USING (true);

-- ============================================
-- DONNÉES DE DÉMARRAGE
-- ============================================

-- Insertion de la société par défaut
INSERT INTO companies (name, siret, address, email, phone) VALUES
('TAC Hockey Club', '12345678900012', '12 rue du Stade, 62520 Le Touquet', 'contact@tachockey.fr', '03 21 00 00 00');

-- Récupération de l'ID de la société (à utiliser pour les insertions suivantes)
DO $$
DECLARE
  company_uuid UUID;
BEGIN
  SELECT id INTO company_uuid FROM companies WHERE name = 'TAC Hockey Club' LIMIT 1;

  -- Paramètres de la société
  INSERT INTO company_settings (company_id, fiscal_year_start, fiscal_year_end, vat_regime, accounting_plan) VALUES
  (company_uuid, '2024-09-01', '2025-08-31', 'NORMAL', 'PCG');

  -- Journaux de base
  INSERT INTO journals (company_id, code, intitule, type) VALUES
  (company_uuid, 'AC', 'Achats', 'ACHAT'),
  (company_uuid, 'VT', 'Ventes', 'VENTE'),
  (company_uuid, 'BQ', 'Banque', 'BANQUE'),
  (company_uuid, 'CA', 'Caisse', 'CAISSE'),
  (company_uuid, 'OD', 'Opérations Diverses', 'OD');

  -- Plan comptable de base
  INSERT INTO accounts (company_id, numero, intitule, type) VALUES
  -- Classe 1 - Capitaux
  (company_uuid, '102000', 'Capital social', 'PASSIF'),
  (company_uuid, '120000', 'Résultat de l''exercice', 'PASSIF'),
  (company_uuid, '164000', 'Emprunts', 'PASSIF'),

  -- Classe 2 - Immobilisations
  (company_uuid, '218100', 'Matériel sportif', 'ACTIF'),
  (company_uuid, '281800', 'Amortissement matériel sportif', 'ACTIF'),

  -- Classe 3 - Stocks (optionnel pour un club)
  (company_uuid, '370000', 'Stock marchandises', 'ACTIF'),

  -- Classe 4 - Tiers
  (company_uuid, '401000', 'Fournisseurs', 'PASSIF'),
  (company_uuid, '411000', 'Clients', 'ACTIF'),
  (company_uuid, '421000', 'Personnel - Rémunérations dues', 'PASSIF'),
  (company_uuid, '431000', 'Sécurité sociale', 'PASSIF'),
  (company_uuid, '445660', 'TVA déductible', 'ACTIF'),
  (company_uuid, '445710', 'TVA collectée', 'PASSIF'),
  (company_uuid, '455000', 'Associés - Comptes courants', 'PASSIF'),

  -- Classe 5 - Financiers
  (company_uuid, '512000', 'Banque', 'ACTIF'),
  (company_uuid, '530000', 'Caisse', 'ACTIF'),

  -- Classe 6 - Charges
  (company_uuid, '606100', 'Achats équipements sportifs', 'CHARGE'),
  (company_uuid, '606200', 'Achats crosses et balles', 'CHARGE'),
  (company_uuid, '611000', 'Sous-traitance générale', 'CHARGE'),
  (company_uuid, '613200', 'Location immobilière', 'CHARGE'),
  (company_uuid, '615000', 'Entretien et réparations', 'CHARGE'),
  (company_uuid, '618000', 'Documentation générale', 'CHARGE'),
  (company_uuid, '623000', 'Publicité', 'CHARGE'),
  (company_uuid, '625000', 'Déplacements', 'CHARGE'),
  (company_uuid, '626000', 'Frais postaux', 'CHARGE'),
  (company_uuid, '627000', 'Services bancaires', 'CHARGE'),
  (company_uuid, '641000', 'Salaires', 'CHARGE'),
  (company_uuid, '645000', 'Charges sociales', 'CHARGE'),
  (company_uuid, '661000', 'Charges d''intérêts', 'CHARGE'),
  (company_uuid, '681100', 'Dotations aux amortissements', 'CHARGE'),

  -- Classe 7 - Produits
  (company_uuid, '706000', 'Cotisations adhérents', 'PRODUIT'),
  (company_uuid, '707000', 'Ventes marchandises', 'PRODUIT'),
  (company_uuid, '740000', 'Subventions d''exploitation', 'PRODUIT'),
  (company_uuid, '756000', 'Sponsors et partenaires', 'PRODUIT'),
  (company_uuid, '758000', 'Produits divers', 'PRODUIT'),
  (company_uuid, '768000', 'Produits financiers', 'PRODUIT');

END $$;

-- ============================================
-- Triggers pour updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regles_updated_at BEFORE UPDATE ON regles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Affichage du résumé
SELECT
  'Base de données créée avec succès !' as message,
  (SELECT COUNT(*) FROM companies) as nb_companies,
  (SELECT COUNT(*) FROM journals) as nb_journals,
  (SELECT COUNT(*) FROM accounts) as nb_accounts;

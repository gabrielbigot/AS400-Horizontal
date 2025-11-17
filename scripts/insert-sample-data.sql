-- ============================================
-- Script d'insertion de données de test
-- Comptabilité AS400 - TAC Hockey
-- ============================================

-- Ce script crée des écritures comptables réalistes pour tester l'application

DO $$
DECLARE
  company_uuid UUID;
  batch_uuid UUID;
BEGIN
  -- Récupération de l'ID de la société
  SELECT id INTO company_uuid FROM companies WHERE name = 'TAC Hockey Club' LIMIT 1;

  -- ============================================
  -- SEPTEMBRE 2024
  -- ============================================

  -- 1. Cotisations adhérents (Septembre)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'VT', '411000', 'D', 2500.00, 'Cotisations septembre 2024', '2024-09-05', 'posted'),
  (company_uuid, batch_uuid, 'VT', '706000', 'C', 2500.00, 'Cotisations septembre 2024', '2024-09-05', 'posted');

  -- 2. Encaissement des cotisations
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '512000', 'D', 2500.00, 'Virement cotisations', '2024-09-10', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '411000', 'C', 2500.00, 'Virement cotisations', '2024-09-10', 'posted');

  -- 3. Achat d'équipements sportifs
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'AC', '606100', 'D', 833.33, 'Achat 10 crosses - Decathlon', '2024-09-15', 'posted'),
  (company_uuid, batch_uuid, 'AC', '445660', 'D', 166.67, 'TVA déductible 20%', '2024-09-15', 'posted'),
  (company_uuid, batch_uuid, 'AC', '401000', 'C', 1000.00, 'Facture F-2024-001', '2024-09-15', 'posted');

  -- 4. Paiement fournisseur équipements
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '401000', 'D', 1000.00, 'Paiement Decathlon F-2024-001', '2024-09-20', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '512000', 'C', 1000.00, 'Paiement Decathlon F-2024-001', '2024-09-20', 'posted');

  -- 5. Sponsor - Entreprise locale
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '512000', 'D', 500.00, 'Sponsor - Boulangerie Martin', '2024-09-25', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '756000', 'C', 500.00, 'Sponsor - Boulangerie Martin', '2024-09-25', 'posted');

  -- ============================================
  -- OCTOBRE 2024
  -- ============================================

  -- 6. Cotisations adhérents (Octobre)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'VT', '411000', 'D', 3200.00, 'Cotisations octobre 2024', '2024-10-05', 'posted'),
  (company_uuid, batch_uuid, 'VT', '706000', 'C', 3200.00, 'Cotisations octobre 2024', '2024-10-05', 'posted');

  -- 7. Achat de balles
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'AC', '606200', 'D', 125.00, 'Achat 50 balles Hockey Pro', '2024-10-08', 'posted'),
  (company_uuid, batch_uuid, 'AC', '445660', 'D', 25.00, 'TVA déductible 20%', '2024-10-08', 'posted'),
  (company_uuid, batch_uuid, 'AC', '401000', 'C', 150.00, 'Facture F-2024-002', '2024-10-08', 'posted');

  -- 8. Location salle de sport
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'OD', '613200', 'D', 416.67, 'Location salle octobre', '2024-10-10', 'posted'),
  (company_uuid, batch_uuid, 'OD', '445660', 'D', 83.33, 'TVA déductible 20%', '2024-10-10', 'posted'),
  (company_uuid, batch_uuid, 'OD', '401000', 'C', 500.00, 'Mairie Le Touquet - Oct 2024', '2024-10-10', 'posted');

  -- 9. Encaissement cotisations octobre
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '512000', 'D', 3200.00, 'Virement cotisations octobre', '2024-10-15', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '411000', 'C', 3200.00, 'Virement cotisations octobre', '2024-10-15', 'posted');

  -- 10. Paiement fournisseur balles
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '401000', 'D', 150.00, 'Paiement F-2024-002', '2024-10-18', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '512000', 'C', 150.00, 'Paiement F-2024-002', '2024-10-18', 'posted');

  -- 11. Vente de marchandises (maillots)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'CA', '530000', 'D', 420.00, 'Vente maillots - espèces', '2024-10-20', 'posted'),
  (company_uuid, batch_uuid, 'CA', '707000', 'C', 350.00, 'Vente 7 maillots', '2024-10-20', 'posted'),
  (company_uuid, batch_uuid, 'CA', '445710', 'C', 70.00, 'TVA collectée 20%', '2024-10-20', 'posted');

  -- 12. Paiement location salle
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '401000', 'D', 500.00, 'Paiement location octobre', '2024-10-25', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '512000', 'C', 500.00, 'Paiement location octobre', '2024-10-25', 'posted');

  -- ============================================
  -- NOVEMBRE 2024
  -- ============================================

  -- 13. Cotisations adhérents (Novembre)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'VT', '411000', 'D', 2800.00, 'Cotisations novembre 2024', '2024-11-05', 'posted'),
  (company_uuid, batch_uuid, 'VT', '706000', 'C', 2800.00, 'Cotisations novembre 2024', '2024-11-05', 'posted');

  -- 14. Subvention municipale
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '512000', 'D', 1500.00, 'Subvention Mairie 2024', '2024-11-08', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '740000', 'C', 1500.00, 'Subvention Mairie 2024', '2024-11-08', 'posted');

  -- 15. Frais de déplacement (tournoi)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'OD', '625000', 'D', 208.33, 'Déplacement tournoi Lille', '2024-11-10', 'posted'),
  (company_uuid, batch_uuid, 'OD', '445660', 'D', 41.67, 'TVA déductible 20%', '2024-11-10', 'posted'),
  (company_uuid, batch_uuid, 'OD', '401000', 'C', 250.00, 'Transport Bus - Novembre', '2024-11-10', 'posted');

  -- 16. Encaissement cotisations novembre
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '512000', 'D', 2800.00, 'Virement cotisations novembre', '2024-11-12', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '411000', 'C', 2800.00, 'Virement cotisations novembre', '2024-11-12', 'posted');

  -- 17. Sponsor - Grande entreprise
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '512000', 'D', 2000.00, 'Sponsor - Crédit Maritime', '2024-11-15', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '756000', 'C', 2000.00, 'Sponsor - Crédit Maritime', '2024-11-15', 'posted');

  -- 18. Location salle novembre
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'OD', '613200', 'D', 416.67, 'Location salle novembre', '2024-11-18', 'posted'),
  (company_uuid, batch_uuid, 'OD', '445660', 'D', 83.33, 'TVA déductible 20%', '2024-11-18', 'posted'),
  (company_uuid, batch_uuid, 'OD', '401000', 'C', 500.00, 'Mairie Le Touquet - Nov 2024', '2024-11-18', 'posted');

  -- 19. Paiement déplacement
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '401000', 'D', 250.00, 'Paiement transport tournoi', '2024-11-20', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '512000', 'C', 250.00, 'Paiement transport tournoi', '2024-11-20', 'posted');

  -- 20. Frais bancaires
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '627000', 'D', 15.00, 'Frais bancaires novembre', '2024-11-25', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '512000', 'C', 15.00, 'Frais bancaires novembre', '2024-11-25', 'posted');

  -- 21. Paiement location novembre
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'BQ', '401000', 'D', 500.00, 'Paiement location novembre', '2024-11-28', 'posted'),
  (company_uuid, batch_uuid, 'BQ', '512000', 'C', 500.00, 'Paiement location novembre', '2024-11-28', 'posted');

  -- ============================================
  -- ÉCRITURES EN BROUILLARD (à valider)
  -- ============================================

  -- 22. Cotisations décembre (en brouillard)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'VT', '411000', 'D', 3000.00, 'Cotisations décembre 2024', '2024-12-05', 'draft'),
  (company_uuid, batch_uuid, 'VT', '706000', 'C', 3000.00, 'Cotisations décembre 2024', '2024-12-05', 'draft');

  -- 23. Achat équipements (en brouillard)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'AC', '606100', 'D', 416.67, 'Achat protections', '2024-12-10', 'draft'),
  (company_uuid, batch_uuid, 'AC', '445660', 'D', 83.33, 'TVA déductible 20%', '2024-12-10', 'draft'),
  (company_uuid, batch_uuid, 'AC', '401000', 'C', 500.00, 'Facture F-2024-003', '2024-12-10', 'draft');

  -- 24. Location décembre (en brouillard)
  batch_uuid := gen_random_uuid();
  INSERT INTO journal_entries (company_id, batch_id, journal_code, compte, s, montant, libelle, date_ecriture, status) VALUES
  (company_uuid, batch_uuid, 'OD', '613200', 'D', 416.67, 'Location salle décembre', '2024-12-12', 'draft'),
  (company_uuid, batch_uuid, 'OD', '445660', 'D', 83.33, 'TVA déductible 20%', '2024-12-12', 'draft'),
  (company_uuid, batch_uuid, 'OD', '401000', 'C', 500.00, 'Mairie Le Touquet - Déc 2024', '2024-12-12', 'draft');

  -- ============================================
  -- LETTRAGE : Rapprochement factures/règlements
  -- ============================================

  -- On lettre les factures et paiements fournisseurs déjà soldés
  -- (Les écritures avec même libellé fournisseur)

  -- Lettrage Decathlon (F-2024-001)
  UPDATE journal_entries
  SET letter_code = 'AA01'
  WHERE libelle LIKE '%Decathlon%'
    AND compte = '401000'
    AND status = 'posted';

  -- Lettrage F-2024-002 (balles)
  UPDATE journal_entries
  SET letter_code = 'AA02'
  WHERE libelle LIKE '%F-2024-002%'
    AND compte = '401000'
    AND status = 'posted';

  -- Lettrage location octobre
  UPDATE journal_entries
  SET letter_code = 'AA03'
  WHERE libelle LIKE '%location octobre%'
    AND compte = '401000'
    AND status = 'posted';

  -- Lettrage transport tournoi
  UPDATE journal_entries
  SET letter_code = 'AA04'
  WHERE libelle LIKE '%transport tournoi%'
    AND compte = '401000'
    AND status = 'posted';

  -- Lettrage location novembre
  UPDATE journal_entries
  SET letter_code = 'AA05'
  WHERE libelle LIKE '%location novembre%'
    AND compte = '401000'
    AND status = 'posted';

  -- Lettrage cotisations clients
  -- Septembre
  UPDATE journal_entries
  SET letter_code = 'BB01'
  WHERE libelle LIKE '%Cotisations septembre%'
    AND compte = '411000'
    AND status = 'posted';

  -- Octobre
  UPDATE journal_entries
  SET letter_code = 'BB02'
  WHERE libelle LIKE '%Cotisations octobre%'
    AND compte = '411000'
    AND status = 'posted';

  -- Novembre
  UPDATE journal_entries
  SET letter_code = 'BB03'
  WHERE libelle LIKE '%Cotisations novembre%'
    AND compte = '411000'
    AND status = 'posted';

END $$;

-- ============================================
-- Affichage du résumé
-- ============================================

SELECT
  '✅ Données de test insérées avec succès !' as message;

SELECT
  'RÉSUMÉ DES ÉCRITURES' as titre,
  (SELECT COUNT(DISTINCT batch_id) FROM journal_entries WHERE status = 'posted') as "Lots validés",
  (SELECT COUNT(DISTINCT batch_id) FROM journal_entries WHERE status = 'draft') as "Lots en brouillard",
  (SELECT COUNT(*) FROM journal_entries WHERE status = 'posted') as "Lignes validées",
  (SELECT COUNT(*) FROM journal_entries WHERE status = 'draft') as "Lignes en brouillard";

SELECT
  'SOLDES DES COMPTES PRINCIPAUX' as titre,
  '512000 - Banque' as compte,
  (
    SELECT COALESCE(SUM(CASE WHEN s = 'D' THEN montant ELSE -montant END), 0)
    FROM journal_entries
    WHERE compte = '512000' AND status = 'posted'
  ) as solde;

SELECT
  '530000 - Caisse' as compte,
  (
    SELECT COALESCE(SUM(CASE WHEN s = 'D' THEN montant ELSE -montant END), 0)
    FROM journal_entries
    WHERE compte = '530000' AND status = 'posted'
  ) as solde;

SELECT
  '706000 - Cotisations' as compte,
  (
    SELECT COALESCE(SUM(CASE WHEN s = 'C' THEN montant ELSE -montant END), 0)
    FROM journal_entries
    WHERE compte = '706000' AND status = 'posted'
  ) as solde;

SELECT
  '756000 - Sponsors' as compte,
  (
    SELECT COALESCE(SUM(CASE WHEN s = 'C' THEN montant ELSE -montant END), 0)
    FROM journal_entries
    WHERE compte = '756000' AND status = 'posted'
  ) as solde;

SELECT
  'LETTRAGE' as titre,
  COUNT(DISTINCT letter_code) as "Nb lettrages effectués",
  COUNT(*) as "Écritures lettrées"
FROM journal_entries
WHERE letter_code IS NOT NULL;

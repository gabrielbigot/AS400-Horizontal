const { createClient } = require('@supabase/supabase-js')

// IMPORTANT: Remplacez cette clé par votre SERVICE_ROLE_KEY depuis Supabase Dashboard
// Settings > API > service_role key (secret)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY_HERE'

const supabase = createClient(
  'https://swsyvokuthjvgmezeodv.supabase.co',
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function initDatabase() {
  console.log('🚀 Initialisation de la base de données...\n')

  try {
    // 1. Créer la société
    console.log('1. Création de la société...')
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'TAC Hockey Club',
        siret: '12345678900012',
        email: 'contact@tachockey.fr',
        phone: '03 21 00 00 00'
      })
      .select()
      .single()

    if (companyError) {
      console.error('❌ Erreur création société:', companyError)
      return
    }

    console.log('✅ Société créée:', company.name)
    const companyId = company.id

    // 2. Créer les paramètres de société
    console.log('\n2. Création des paramètres...')
    const { error: settingsError } = await supabase
      .from('company_settings')
      .insert({
        company_id: companyId,
        fiscal_year_start: '2024-09-01',
        fiscal_year_end: '2025-08-31',
        vat_regime: 'NORMAL',
        accounting_plan: 'PCG'
      })

    if (settingsError) {
      console.error('❌ Erreur paramètres:', settingsError)
    } else {
      console.log('✅ Paramètres créés')
    }

    // 3. Créer les journaux de base
    console.log('\n3. Création des journaux...')
    const journals = [
      { code: 'AC', intitule: 'Achats', type: 'ACHAT' },
      { code: 'VT', intitule: 'Ventes', type: 'VENTE' },
      { code: 'BQ', intitule: 'Banque', type: 'BANQUE' },
      { code: 'CA', intitule: 'Caisse', type: 'CAISSE' },
      { code: 'OD', intitule: 'Opérations Diverses', type: 'OD' }
    ]

    for (const journal of journals) {
      const { error } = await supabase.from('journals').insert({
        company_id: companyId,
        ...journal
      })
      if (error) {
        console.error(`❌ Erreur journal ${journal.code}:`, error)
      } else {
        console.log(`✅ Journal ${journal.code} créé`)
      }
    }

    // 4. Créer les comptes de base
    console.log('\n4. Création des comptes de base...')
    const accounts = [
      { numero: '401000', intitule: 'Fournisseurs', type: 'PASSIF' },
      { numero: '411000', intitule: 'Clients', type: 'ACTIF' },
      { numero: '512000', intitule: 'Banque', type: 'ACTIF' },
      { numero: '530000', intitule: 'Caisse', type: 'ACTIF' },
      { numero: '445660', intitule: 'TVA déductible', type: 'ACTIF' },
      { numero: '445710', intitule: 'TVA collectée', type: 'PASSIF' },
      { numero: '606100', intitule: 'Achats d\'équipements', type: 'CHARGE' },
      { numero: '706000', intitule: 'Cotisations', type: 'PRODUIT' },
      { numero: '756000', intitule: 'Sponsors', type: 'PRODUIT' }
    ]

    for (const account of accounts) {
      const { error } = await supabase.from('accounts').insert({
        company_id: companyId,
        ...account
      })
      if (error) {
        console.error(`❌ Erreur compte ${account.numero}:`, error)
      } else {
        console.log(`✅ Compte ${account.numero} créé`)
      }
    }

    console.log('\n🎉 Base de données initialisée avec succès!')
    console.log(`\n📊 ID de la société: ${companyId}`)

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Vérifier si la clé service est configurée
if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_KEY_HERE') {
  console.error('❌ ERREUR: Veuillez configurer SUPABASE_SERVICE_KEY')
  console.log('\n📝 Instructions:')
  console.log('1. Allez sur https://supabase.com/dashboard')
  console.log('2. Sélectionnez votre projet')
  console.log('3. Settings > API > service_role key')
  console.log('4. Copiez la clé et exécutez:')
  console.log('   set SUPABASE_SERVICE_KEY=votre_cle')
  console.log('   node scripts/init-db.js')
  process.exit(1)
}

initDatabase()

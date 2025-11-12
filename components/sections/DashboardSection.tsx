"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DashboardSkeleton } from "@/components/ui/skeleton"

interface DashboardSectionProps {
  isActive: boolean
}

interface DashboardData {
  tresorerie: number
  resultat: number
  produits: number
  charges: number
  ecrituresMois: number
  ecrituresExercice: number
  comptesActifs: number
  journauxActifs: number
}

interface MonthlyData {
  mois: string
  produits: number
  charges: number
  tresorerie: number
}

interface ExpenseCategory {
  nom: string
  montant: number
}

interface TopAccount {
  numero: string
  intitule: string
  montant: number
  operations: number
}

export function DashboardSection({ isActive }: DashboardSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    tresorerie: 0,
    resultat: 0,
    produits: 0,
    charges: 0,
    ecrituresMois: 0,
    ecrituresExercice: 0,
    comptesActifs: 0,
    journauxActifs: 0,
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([])
  const [topAccounts, setTopAccounts] = useState<TopAccount[]>([])

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadDashboardData()
    }
  }, [isActive])

  async function loadDashboardData() {
    try {
      setLoading(true)

      // Get first company (for demo purposes)
      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .limit(1)

      if (!companies || companies.length === 0) {
        console.log('No company found, using mock data')
        setLoading(false)
        return
      }

      const companyId = companies[0].id

      // Get all entries for calculations
      const { data: entries } = await supabase
        .from('journal_entries')
        .select('compte, s, montant, date_ecriture, status')
        .eq('company_id', companyId)
        .eq('status', 'posted')

      // Calculate treasury (accounts 512xxx and 53xxxx)
      let tresorerie = 0
      let produits = 0
      let charges = 0

      entries?.forEach((entry) => {
        const compte = entry.compte
        const montant = entry.montant
        const sens = entry.s

        // Treasury calculation (Banque 512 + Caisse 53)
        if (compte.startsWith('512') || compte.startsWith('53')) {
          tresorerie += sens === 'D' ? montant : -montant
        }

        // Revenue (class 7)
        if (compte.startsWith('7')) {
          produits += sens === 'C' ? montant : -montant
        }

        // Expenses (class 6)
        if (compte.startsWith('6')) {
          charges += sens === 'D' ? montant : -montant
        }
      })

      const resultat = produits - charges

      // Get entries count for current month
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const { count: ecrituresMois } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('date_ecriture', firstDayOfMonth.toISOString())

      // Get total entries count
      const { count: ecrituresExercice } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      // Get active accounts count
      const { count: comptesActifs } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      // Get active journals count
      const { count: journauxActifs } = await supabase
        .from('journals')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      setDashboardData({
        tresorerie: parseFloat(tresorerie.toFixed(2)),
        resultat: parseFloat(resultat.toFixed(2)),
        produits: parseFloat(produits.toFixed(2)),
        charges: parseFloat(charges.toFixed(2)),
        ecrituresMois: ecrituresMois || 0,
        ecrituresExercice: ecrituresExercice || 0,
        comptesActifs: comptesActifs || 0,
        journauxActifs: journauxActifs || 0,
      })

      // Calculate monthly data for last 6 months
      const monthlyMap = new Map<string, { produits: number, charges: number, tresorerie: number }>()

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
        monthlyMap.set(monthKey, { produits: 0, charges: 0, tresorerie: 0 })
      }

      entries?.forEach((entry) => {
        const entryDate = new Date(entry.date_ecriture)
        const monthKey = entryDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })

        if (monthlyMap.has(monthKey)) {
          const data = monthlyMap.get(monthKey)!

          if (entry.compte.startsWith('7')) {
            data.produits += entry.s === 'C' ? entry.montant : -entry.montant
          }
          if (entry.compte.startsWith('6')) {
            data.charges += entry.s === 'D' ? entry.montant : -entry.montant
          }
          if (entry.compte.startsWith('512') || entry.compte.startsWith('53')) {
            data.tresorerie += entry.s === 'D' ? entry.montant : -entry.montant
          }
        }
      })

      const monthlyArray: MonthlyData[] = []
      monthlyMap.forEach((value, key) => {
        monthlyArray.push({
          mois: key,
          produits: parseFloat(value.produits.toFixed(2)),
          charges: parseFloat(value.charges.toFixed(2)),
          tresorerie: parseFloat(value.tresorerie.toFixed(2)),
        })
      })
      setMonthlyData(monthlyArray)

      // Calculate expense categories (by first digit of account 6x)
      const categoryMap = new Map<string, number>()
      const categoryNames: { [key: string]: string } = {
        '60': 'Achats',
        '61': 'Services ext.',
        '62': 'Autres services',
        '63': 'Impôts/taxes',
        '64': 'Personnel',
        '65': 'Gestion courante',
        '66': 'Financières',
        '67': 'Exceptionnelles',
        '68': 'Amortissements',
      }

      entries?.forEach((entry) => {
        if (entry.compte.startsWith('6')) {
          const prefix = entry.compte.substring(0, 2)
          const current = categoryMap.get(prefix) || 0
          categoryMap.set(prefix, current + (entry.s === 'D' ? entry.montant : -entry.montant))
        }
      })

      const categoriesArray: ExpenseCategory[] = []
      categoryMap.forEach((montant, prefix) => {
        if (montant > 0) {
          categoriesArray.push({
            nom: categoryNames[prefix] || prefix,
            montant: parseFloat(montant.toFixed(2)),
          })
        }
      })
      categoriesArray.sort((a, b) => b.montant - a.montant)
      setExpenseCategories(categoriesArray)

      // Calculate top 5 accounts by activity
      const accountMap = new Map<string, { montant: number, operations: number }>()
      entries?.forEach((entry) => {
        const current = accountMap.get(entry.compte) || { montant: 0, operations: 0 }
        accountMap.set(entry.compte, {
          montant: current.montant + entry.montant,
          operations: current.operations + 1,
        })
      })

      // Get account names
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('numero, intitule')
        .eq('company_id', companyId)

      const accountsArray: TopAccount[] = []
      accountMap.forEach((value, numero) => {
        const account = accountsData?.find(a => a.numero === numero)
        accountsArray.push({
          numero,
          intitule: account?.intitule || 'Compte inconnu',
          montant: parseFloat(value.montant.toFixed(2)),
          operations: value.operations,
        })
      })
      accountsArray.sort((a, b) => b.operations - a.operations)
      setTopAccounts(accountsArray.slice(0, 5))

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / TAC HOCKEY
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Tableau de
            <br />
            <span className="text-muted-foreground">Bord</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Vue d&apos;ensemble de votre comptabilité en temps réel. Suivez vos indicateurs financiers et l&apos;activité de votre club.
          </p>
        </header>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
        {/* Indicateurs financiers principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-lg space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
            <div className="text-sm text-muted-foreground font-mono">TRÉSORERIE</div>
            <div className={`text-3xl font-light ${dashboardData.tresorerie >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(dashboardData.tresorerie)}
            </div>
            <div className="text-xs text-muted-foreground">Banque + Caisse</div>
          </div>

          <div className="glass p-6 rounded-lg space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
            <div className="text-sm text-muted-foreground font-mono">RÉSULTAT</div>
            <div className={`text-3xl font-light ${dashboardData.resultat >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(dashboardData.resultat)}
            </div>
            <div className="text-xs text-muted-foreground">
              {dashboardData.resultat >= 0 ? "BÉNÉFICE" : "DÉFICIT"}
            </div>
          </div>

          <div className="glass p-6 rounded-lg space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
            <div className="text-sm text-muted-foreground font-mono">PRODUITS</div>
            <div className="text-3xl font-light text-green-500">
              {formatCurrency(dashboardData.produits)}
            </div>
            <div className="text-xs text-muted-foreground">Total exercice</div>
          </div>

          <div className="glass p-6 rounded-lg space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
            <div className="text-sm text-muted-foreground font-mono">CHARGES</div>
            <div className="text-3xl font-light text-red-500">
              {formatCurrency(dashboardData.charges)}
            </div>
            <div className="text-xs text-muted-foreground">Total exercice</div>
          </div>
        </div>

        {/* Visualisations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light">Évolutions & Analyses</h2>

          {/* Revenue/Expenses Evolution Chart */}
          <div className="glass p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-light">Évolution sur 6 mois</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="mois"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="produits"
                  stroke="#22c55e"
                  name="Produits"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="charges"
                  stroke="#ef4444"
                  name="Charges"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Categories Pie Chart */}
            <div className="glass p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-light">Charges par catégorie</h3>
              {expenseCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      dataKey="montant"
                      nameKey="nom"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.nom}: ${((entry.montant / expenseCategories.reduce((sum, cat) => sum + cat.montant, 0)) * 100).toFixed(1)}%`}
                      labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                    >
                      {expenseCategories.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={[
                            '#ef4444', '#f97316', '#f59e0b', '#eab308',
                            '#84cc16', '#22c55e', '#10b981', '#14b8a6'
                          ][index % 8]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Aucune donnée de charges disponible
                </div>
              )}
            </div>

            {/* Treasury Evolution Chart */}
            <div className="glass p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-light">Évolution de la trésorerie</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="mois"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="tresorerie"
                    stroke="#3b82f6"
                    name="Trésorerie"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Accounts */}
          <div className="glass p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-light">Top 5 des comptes les plus actifs</h3>
            <div className="space-y-3">
              {topAccounts.map((account, index) => (
                <div
                  key={account.numero}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-light text-muted-foreground">#{index + 1}</div>
                    <div>
                      <div className="font-mono text-sm">{account.numero}</div>
                      <div className="text-sm text-muted-foreground">{account.intitule}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{formatCurrency(account.montant)}</div>
                    <div className="text-xs text-muted-foreground">{account.operations} opérations</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activité */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light">Activité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-border rounded-lg p-6 space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
              <div className="text-sm text-muted-foreground">Écritures ce mois</div>
              <div className="text-4xl font-light">{dashboardData.ecrituresMois}</div>
            </div>

            <div className="border border-border rounded-lg p-6 space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
              <div className="text-sm text-muted-foreground">Écritures exercice</div>
              <div className="text-4xl font-light">{dashboardData.ecrituresExercice}</div>
            </div>

            <div className="border border-border rounded-lg p-6 space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
              <div className="text-sm text-muted-foreground">Comptes actifs</div>
              <div className="text-4xl font-light">{dashboardData.comptesActifs}</div>
            </div>

            <div className="border border-border rounded-lg p-6 space-y-2 hover:border-muted-foreground/50 transition-all duration-300">
              <div className="text-sm text-muted-foreground">Journaux actifs</div>
              <div className="text-4xl font-light">{dashboardData.journauxActifs}</div>
            </div>
          </div>
        </div>

        {/* Alertes */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light">Alertes</h2>
          <div className="glass p-6 rounded-lg border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-500 font-medium">Aucune alerte</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Votre comptabilité est à jour. Continuez votre excellent travail !
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="group p-6 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-left">
              <div className="space-y-2">
                <div className="text-lg font-medium group-hover:text-muted-foreground transition-colors">
                  Nouvelle écriture
                </div>
                <div className="text-sm text-muted-foreground">
                  Saisir une opération comptable
                </div>
              </div>
            </button>

            <button className="group p-6 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-left">
              <div className="space-y-2">
                <div className="text-lg font-medium group-hover:text-muted-foreground transition-colors">
                  Consulter rapports
                </div>
                <div className="text-sm text-muted-foreground">
                  Balance, Grand Livre, FEC...
                </div>
              </div>
            </button>

            <button className="group p-6 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-left">
              <div className="space-y-2">
                <div className="text-lg font-medium group-hover:text-muted-foreground transition-colors">
                  Assistant IA
                </div>
                <div className="text-sm text-muted-foreground">
                  Posez vos questions comptables
                </div>
              </div>
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  )
}

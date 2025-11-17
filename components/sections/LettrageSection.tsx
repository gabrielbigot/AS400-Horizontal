"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { formatCurrency, formatDate } from "@/lib/utils"

interface LettrageSectionProps {
  isActive: boolean
}

interface Entry {
  id: string
  compte: string
  s: string
  montant: number
  libelle: string
  date_ecriture: string
  letter_code: string | null
  selected?: boolean
}

export function LettrageSection({ isActive }: LettrageSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadCompany()
    }
  }, [isActive])

  useEffect(() => {
    if (companyId) {
      loadAllUnletteredEntries()
    }
  }, [companyId])

  async function loadCompany() {
    const { data: companies } = await supabase
      .from("companies")
      .select("id")
      .limit(1)

    if (companies && companies.length > 0) {
      setCompanyId(companies[0].id)
    }
  }

  async function loadAllUnletteredEntries() {
    if (!companyId) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("company_id", companyId)
        .eq("status", "posted")
        .is("letter_code", null)
        .order("compte", { ascending: true })
        .order("date_ecriture", { ascending: false })

      if (error) {
        console.error("Error loading entries:", error)
        alert("Erreur lors du chargement: " + error.message)
      } else {
        setEntries(data || [])
      }
    } catch (error: any) {
      console.error("Error loading entries:", error)
      alert("Erreur: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadEntries() {
    if (!companyId || !accountNumber) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("company_id", companyId)
        .eq("compte", accountNumber)
        .eq("status", "posted")
        .order("date_ecriture", { ascending: false })

      if (error) {
        console.error("Error loading entries:", error)
        alert("Erreur lors du chargement: " + error.message)
      } else {
        setEntries(data || [])
      }
    } catch (error: any) {
      console.error("Error loading entries:", error)
      alert("Erreur: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleSelection(id: string) {
    const newSelected = new Set(selectedEntries)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedEntries(newSelected)
  }

  function calculateSelectedBalance() {
    let debit = 0
    let credit = 0

    entries.forEach((entry) => {
      if (selectedEntries.has(entry.id)) {
        if (entry.s === "D") {
          debit += entry.montant
        } else {
          credit += entry.montant
        }
      }
    })

    return {
      debit: parseFloat(debit.toFixed(2)),
      credit: parseFloat(credit.toFixed(2)),
      balance: parseFloat((debit - credit).toFixed(2)),
    }
  }

  async function letterSelectedEntries() {
    if (selectedEntries.size < 2) {
      alert("Veuillez sélectionner au moins 2 écritures à lettrer")
      return
    }

    const balance = calculateSelectedBalance()
    if (Math.abs(balance.balance) > 0.01) {
      alert(
        `Les écritures sélectionnées ne sont pas équilibrées. Différence: ${formatCurrency(
          balance.balance
        )}`
      )
      return
    }

    try {
      // Generate letter code (e.g., AA, AB, AC...)
      const letterCode = generateLetterCode()

      const { error } = await supabase
        .from("journal_entries")
        .update({ letter_code: letterCode })
        .in("id", Array.from(selectedEntries))

      if (error) throw error

      alert(`${selectedEntries.size} écritures lettrées avec le code ${letterCode}`)
      setSelectedEntries(new Set())
      if (accountNumber) {
        loadEntries()
      } else {
        loadAllUnletteredEntries()
      }
    } catch (error: any) {
      console.error("Error lettering entries:", error)
      alert("Erreur: " + error.message)
    }
  }

  async function unletterEntry(letterCode: string) {
    if (!confirm(`Délettrer les écritures avec le code ${letterCode} ?`)) return

    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({ letter_code: null })
        .eq("letter_code", letterCode)
        .eq("company_id", companyId)

      if (error) throw error

      alert("Écritures délettrées avec succès")
      if (accountNumber) {
        loadEntries()
      } else {
        loadAllUnletteredEntries()
      }
    } catch (error: any) {
      console.error("Error unlettering entries:", error)
      alert("Erreur: " + error.message)
    }
  }

  function generateLetterCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    return timestamp.slice(-4)
  }

  const balance = calculateSelectedBalance()
  const isBalanced = Math.abs(balance.balance) < 0.01
  const unlettered = entries.filter((e) => !e.letter_code)
  const lettered = entries.filter((e) => e.letter_code)

  // Grouper les écritures non lettrées par compte
  const unletteredByAccount = unlettered.reduce((acc, entry) => {
    if (!acc[entry.compte]) acc[entry.compte] = []
    acc[entry.compte].push(entry)
    return acc
  }, {} as Record<string, Entry[]>)

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / LETTRAGE
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Lettrage des
            <br />
            <span className="text-muted-foreground">Comptes</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Rapprochez vos écritures débit et crédit pour identifier les factures payées.
          </p>
        </header>

        <div className="glass p-8 rounded-lg space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Filtrer par compte (optionnel)</label>
              {accountNumber && (
                <button
                  onClick={() => {
                    setAccountNumber("")
                    loadAllUnletteredEntries()
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Réinitialiser le filtre
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Numéro de compte (ex: 411000, 401000)"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={loadEntries}
                disabled={loading || !accountNumber}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Chargement..." : "Filtrer"}
              </button>
            </div>
          </div>

          {!accountNumber && entries.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Affichage de toutes les écritures non lettrées ({entries.length} écriture(s))
            </div>
          )}
          {accountNumber && entries.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Affichage des écritures du compte {accountNumber} ({entries.length} écriture(s))
            </div>
          )}
        </div>

        {entries.length > 0 && (
          <>
            {/* Selection controls */}
            {selectedEntries.size > 0 && (
              <div className="glass p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      {selectedEntries.size} écriture(s) sélectionnée(s)
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span>
                        Débit: <span className="font-mono">{formatCurrency(balance.debit)}</span>
                      </span>
                      <span>
                        Crédit: <span className="font-mono">{formatCurrency(balance.credit)}</span>
                      </span>
                      <span>
                        Balance:{" "}
                        <span className={`font-mono ${isBalanced ? "text-green-500" : "text-red-500"}`}>
                          {formatCurrency(balance.balance)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedEntries(new Set())}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={letterSelectedEntries}
                      disabled={!isBalanced || selectedEntries.size < 2}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Lettrer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Unlettered entries */}
            {unlettered.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-light">
                  Écritures non lettrées ({unlettered.length})
                </h2>

                {!accountNumber ? (
                  // Affichage groupé par compte
                  <div className="space-y-6">
                    {Object.entries(unletteredByAccount).map(([compte, accountEntries]) => (
                      <div key={compte} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-mono font-medium">{compte}</div>
                          <div className="text-xs text-muted-foreground">
                            {accountEntries.length} écriture(s)
                          </div>
                        </div>
                        <div className="space-y-2">
                          {accountEntries.map((entry) => (
                            <div
                              key={entry.id}
                              onClick={() => toggleSelection(entry.id)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedEntries.has(entry.id)
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-muted-foreground/50"
                              }`}
                            >
                              <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedEntries.has(entry.id)}
                                    onChange={() => {}}
                                    className="w-4 h-4"
                                  />
                                </div>
                                <div className="col-span-2 font-mono text-sm">
                                  {formatDate(entry.date_ecriture)}
                                </div>
                                <div className="col-span-1 text-sm">{entry.s}</div>
                                <div className="col-span-2 font-mono text-sm">
                                  {formatCurrency(entry.montant)}
                                </div>
                                <div className="col-span-6 text-sm text-muted-foreground">
                                  {entry.libelle}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Affichage simple pour un compte spécifique
                  <div className="space-y-2">
                    {unlettered.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => toggleSelection(entry.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedEntries.has(entry.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1">
                            <input
                              type="checkbox"
                              checked={selectedEntries.has(entry.id)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                          </div>
                          <div className="col-span-2 font-mono text-sm">
                            {formatDate(entry.date_ecriture)}
                          </div>
                          <div className="col-span-1 text-sm">{entry.s}</div>
                          <div className="col-span-2 font-mono text-sm">
                            {formatCurrency(entry.montant)}
                          </div>
                          <div className="col-span-6 text-sm text-muted-foreground">
                            {entry.libelle}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Lettered entries */}
            {lettered.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-light">
                  Écritures lettrées ({lettered.length})
                </h2>
                {Object.entries(
                  lettered.reduce((acc, entry) => {
                    if (!entry.letter_code) return acc
                    if (!acc[entry.letter_code]) acc[entry.letter_code] = []
                    acc[entry.letter_code].push(entry)
                    return acc
                  }, {} as Record<string, Entry[]>)
                ).map(([code, entries]) => (
                  <div key={code} className="glass p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div className="text-sm font-mono">
                        Lettrage {code} - {entries.length} ligne(s)
                      </div>
                      <button
                        onClick={() => unletterEntry(code)}
                        className="text-xs px-3 py-1 border border-destructive text-destructive rounded hover:bg-destructive/10"
                      >
                        Délettrer
                      </button>
                    </div>
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="grid grid-cols-12 gap-4 text-sm py-1"
                      >
                        <div className="col-span-2 font-mono">
                          {formatDate(entry.date_ecriture)}
                        </div>
                        <div className="col-span-1">{entry.s}</div>
                        <div className="col-span-2 font-mono">
                          {formatCurrency(entry.montant)}
                        </div>
                        <div className="col-span-7 text-muted-foreground">
                          {entry.libelle}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

interface EcrituresSectionProps {
  isActive: boolean
}

interface EntryLine {
  id: string
  compte: string
  s: "D" | "C"
  montant: string
  libelle: string
  date: string
}

export function EcrituresSection({ isActive }: EcrituresSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [journalCode, setJournalCode] = useState("OD")
  const [journals, setJournals] = useState<Array<{ code: string; intitule: string }>>([])
  const [accounts, setAccounts] = useState<Array<{ numero: string; intitule: string }>>([])

  const [lines, setLines] = useState<EntryLine[]>([
    {
      id: uuidv4(),
      compte: "",
      s: "D",
      montant: "",
      libelle: "",
      date: new Date().toISOString().split("T")[0],
    },
  ])

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadInitialData()
    }
  }, [isActive])

  async function loadInitialData() {
    try {
      // Get first company
      const { data: companies } = await supabase
        .from("companies")
        .select("id")
        .limit(1)

      if (companies && companies.length > 0) {
        setCompanyId(companies[0].id)

        // Load journals
        const { data: journalsData } = await supabase
          .from("journals")
          .select("code, intitule")
          .eq("company_id", companies[0].id)

        if (journalsData) {
          setJournals(journalsData)
        }

        // Load accounts
        const { data: accountsData } = await supabase
          .from("accounts")
          .select("numero, intitule")
          .eq("company_id", companies[0].id)
          .order("numero")

        if (accountsData) {
          setAccounts(accountsData)
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
    }
  }

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: uuidv4(),
        compte: "",
        s: "D",
        montant: "",
        libelle: "",
        date: new Date().toISOString().split("T")[0],
      },
    ])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter((line) => line.id !== id))
    }
  }

  const updateLine = (id: string, field: keyof EntryLine, value: string) => {
    setLines(
      lines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
    )
  }

  const calculateTotals = () => {
    let debit = 0
    let credit = 0

    lines.forEach((line) => {
      const amount = parseFloat(line.montant) || 0
      if (line.s === "D") {
        debit += amount
      } else {
        credit += amount
      }
    })

    return {
      debit: parseFloat(debit.toFixed(2)),
      credit: parseFloat(credit.toFixed(2)),
      balance: parseFloat((debit - credit).toFixed(2)),
    }
  }

  const saveBatch = async () => {
    if (!companyId) {
      alert("Aucune société sélectionnée")
      return
    }

    const totals = calculateTotals()

    // Check if batch is balanced
    if (Math.abs(totals.balance) > 0.01) {
      alert(`Le lot n'est pas équilibré. Différence: ${formatCurrency(totals.balance)}`)
      return
    }

    // Check if all fields are filled
    const hasEmptyFields = lines.some(
      (line) => !line.compte || !line.montant || !line.libelle || !line.date
    )

    if (hasEmptyFields) {
      alert("Veuillez remplir tous les champs")
      return
    }

    try {
      setLoading(true)
      const batchId = uuidv4()

      // Prepare entries for insertion
      const entries = lines.map((line) => ({
        company_id: companyId,
        batch_id: batchId,
        journal_code: journalCode,
        compte: line.compte,
        s: line.s,
        montant: parseFloat(line.montant),
        libelle: line.libelle,
        date_ecriture: line.date,
        status: "draft",
      }))

      const { error } = await supabase.from("journal_entries").insert(entries)

      if (error) {
        console.error("Error saving batch:", error)
        alert("Erreur lors de l'enregistrement: " + error.message)
      } else {
        alert("Lot enregistré avec succès!")
        // Reset form
        setLines([
          {
            id: uuidv4(),
            compte: "",
            s: "D",
            montant: "",
            libelle: "",
            date: new Date().toISOString().split("T")[0],
          },
        ])
      }
    } catch (error) {
      console.error("Error saving batch:", error)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  const totals = calculateTotals()
  const isBalanced = Math.abs(totals.balance) < 0.01

  return (
    <div
      className={`min-h-screen p-8 lg:p-16 ${
        mounted ? "animate-fade-in-up" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / ÉCRITURES
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Saisie
            <br />
            <span className="text-muted-foreground">d&apos;Écritures</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Enregistrez vos opérations comptables en respectant le principe de la
            partie double.
          </p>
        </header>

        <div className="glass p-8 rounded-lg space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light">Nouvelle écriture</h2>
            <div className="flex gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Journal: </span>
                <select
                  value={journalCode}
                  onChange={(e) => setJournalCode(e.target.value)}
                  className="bg-background border border-border rounded px-3 py-1"
                >
                  {journals.map((journal) => (
                    <option key={journal.code} value={journal.code}>
                      {journal.code} - {journal.intitule}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-mono text-muted-foreground pb-2 border-b border-border">
              <div className="col-span-3">Compte</div>
              <div className="col-span-1">S</div>
              <div className="col-span-2">Montant</div>
              <div className="col-span-4">Libellé</div>
              <div className="col-span-2">Date</div>
            </div>

            {lines.map((line) => (
              <div key={line.id} className="grid grid-cols-12 gap-4 items-center">
                <input
                  type="text"
                  list="accounts-list"
                  placeholder="Numéro compte"
                  value={line.compte}
                  onChange={(e) => updateLine(line.id, "compte", e.target.value)}
                  className="col-span-3 px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select
                  value={line.s}
                  onChange={(e) =>
                    updateLine(line.id, "s", e.target.value as "D" | "C")
                  }
                  className="col-span-1 px-2 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="D">D</option>
                  <option value="C">C</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={line.montant}
                  onChange={(e) => updateLine(line.id, "montant", e.target.value)}
                  className="col-span-2 px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={line.libelle}
                  onChange={(e) => updateLine(line.id, "libelle", e.target.value)}
                  className="col-span-4 px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="date"
                  value={line.date}
                  onChange={(e) => updateLine(line.id, "date", e.target.value)}
                  className="col-span-2 px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {lines.length > 1 && (
                  <button
                    onClick={() => removeLine(line.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <datalist id="accounts-list">
              {accounts.map((account) => (
                <option key={account.numero} value={account.numero}>
                  {account.intitule}
                </option>
              ))}
            </datalist>

            <button
              onClick={addLine}
              className="w-full py-3 border border-dashed border-border rounded-lg hover:border-muted-foreground/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              + Ajouter une ligne
            </button>
          </div>

          <div className="pt-6 border-t border-border flex justify-between items-center">
            <div className="space-y-1 text-sm">
              <div className="flex gap-8">
                <span className="text-muted-foreground">
                  Débit total:{" "}
                  <span className="text-foreground font-mono">
                    {formatCurrency(totals.debit)}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Crédit total:{" "}
                  <span className="text-foreground font-mono">
                    {formatCurrency(totals.credit)}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Solde:{" "}
                  <span
                    className={`font-mono ${
                      isBalanced ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatCurrency(totals.balance)}
                  </span>
                </span>
              </div>
              {isBalanced && (
                <div className="text-green-500 text-xs">✓ Lot équilibré</div>
              )}
              {!isBalanced && (
                <div className="text-red-500 text-xs">
                  ⚠ Lot non équilibré
                </div>
              )}
            </div>
            <button
              onClick={saveBatch}
              disabled={loading || !isBalanced}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enregistrement..." : "Enregistrer le lot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

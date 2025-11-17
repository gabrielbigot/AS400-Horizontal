"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { formatCurrency, formatDate } from "@/lib/utils"

interface BrouillardSectionProps {
  isActive: boolean
}

interface DraftBatch {
  batch_id: string
  entries: Array<{
    id: string
    compte: string
    s: string
    montant: number
    libelle: string
    date_ecriture: string
    journal_code: string
  }>
  debit_total: number
  credit_total: number
  date: string
}

export function BrouillardSection({ isActive }: BrouillardSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [batches, setBatches] = useState<DraftBatch[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadDraftBatches()
    }
  }, [isActive])

  async function loadDraftBatches() {
    try {
      setLoading(true)

      // Get first company
      const { data: companies } = await supabase
        .from("companies")
        .select("id")
        .limit(1)

      if (!companies || companies.length === 0) {
        setLoading(false)
        return
      }

      setCompanyId(companies[0].id)

      // Load draft entries
      const { data: entries, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("company_id", companies[0].id)
        .eq("status", "draft")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading draft entries:", error)
        setLoading(false)
        return
      }

      // Group by batch_id
      const batchMap = new Map<string, DraftBatch>()

      entries?.forEach((entry) => {
        if (!batchMap.has(entry.batch_id)) {
          batchMap.set(entry.batch_id, {
            batch_id: entry.batch_id,
            entries: [],
            debit_total: 0,
            credit_total: 0,
            date: entry.date_ecriture,
          })
        }

        const batch = batchMap.get(entry.batch_id)!
        batch.entries.push(entry)

        if (entry.s === "D") {
          batch.debit_total += entry.montant
        } else {
          batch.credit_total += entry.montant
        }
      })

      setBatches(Array.from(batchMap.values()))
    } catch (error) {
      console.error("Error loading draft batches:", error)
    } finally {
      setLoading(false)
    }
  }

  async function validateBatch(batchId: string) {
    if (!companyId) return

    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({ status: "posted" })
        .eq("batch_id", batchId)
        .eq("company_id", companyId)

      if (error) {
        console.error("Error validating batch:", error)
        alert("Erreur lors de la validation: " + error.message)
      } else {
        alert("Lot validé avec succès!")
        loadDraftBatches()
      }
    } catch (error) {
      console.error("Error validating batch:", error)
      alert("Erreur lors de la validation")
    }
  }

  async function deleteBatch(batchId: string) {
    if (!companyId) return

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce lot ?")) {
      return
    }

    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("batch_id", batchId)
        .eq("company_id", companyId)

      if (error) {
        console.error("Error deleting batch:", error)
        alert("Erreur lors de la suppression: " + error.message)
      } else {
        alert("Lot supprimé avec succès!")
        loadDraftBatches()
      }
    } catch (error) {
      console.error("Error deleting batch:", error)
      alert("Erreur lors de la suppression")
    }
  }

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / BROUILLARD
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Gestion du
            <br />
            <span className="text-muted-foreground">Brouillard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Validez vos écritures en attente. Les écritures validées ne pourront plus être modifiées.
          </p>
        </header>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Chargement des brouillards...</div>
          </div>
        )}

        {!loading && batches.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucune écriture en brouillard pour le moment.</p>
          </div>
        )}

        {!loading && batches.length > 0 && (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              {batches.length} lot(s) en brouillard
            </div>

            {batches.map((batch) => {
              const isBalanced =
                Math.abs(batch.debit_total - batch.credit_total) < 0.01

              return (
                <div
                  key={batch.batch_id}
                  className="glass rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground font-mono">
                        Lot {batch.batch_id.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(batch.date)} · {batch.entries.length}{" "}
                        ligne(s)
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => validateBatch(batch.batch_id)}
                        disabled={!isBalanced}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => deleteBatch(batch.batch_id)}
                        className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-4 text-sm font-mono text-muted-foreground pb-2 border-b border-border/50">
                      <div className="col-span-2">Compte</div>
                      <div className="col-span-1">S</div>
                      <div className="col-span-2">Montant</div>
                      <div className="col-span-5">Libellé</div>
                      <div className="col-span-2">Date</div>
                    </div>

                    {batch.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="grid grid-cols-12 gap-4 text-sm py-2"
                      >
                        <div className="col-span-2 font-mono">{entry.compte}</div>
                        <div className="col-span-1">{entry.s}</div>
                        <div className="col-span-2">
                          {formatCurrency(entry.montant)}
                        </div>
                        <div className="col-span-5 text-muted-foreground">
                          {entry.libelle}
                        </div>
                        <div className="col-span-2 text-muted-foreground">
                          {formatDate(entry.date_ecriture)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border flex justify-between items-center text-sm">
                    <div className="flex gap-6">
                      <span className="text-muted-foreground">
                        Débit:{" "}
                        <span className="text-foreground font-mono">
                          {formatCurrency(batch.debit_total)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Crédit:{" "}
                        <span className="text-foreground font-mono">
                          {formatCurrency(batch.credit_total)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Balance:{" "}
                        <span
                          className={`font-mono ${
                            isBalanced ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {formatCurrency(
                            batch.debit_total - batch.credit_total
                          )}
                        </span>
                      </span>
                    </div>
                    {isBalanced && (
                      <div className="text-green-500 text-xs">
                        ✓ Lot équilibré
                      </div>
                    )}
                    {!isBalanced && (
                      <div className="text-red-500 text-xs">
                        ⚠ Lot non équilibré
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

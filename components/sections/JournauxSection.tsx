"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Modal } from "@/components/ui/modal"
import { formatCurrency, formatDate } from "@/lib/utils"

interface JournauxSectionProps {
  isActive: boolean
}

interface Journal {
  id: string
  code: string
  intitule: string
  type: string
}

interface JournalEntry {
  id: string
  date_ecriture: string
  libelle: string
  compte: string
  s: 'D' | 'C'
  montant: number
  status: string
  letter_code?: string
}

export function JournauxSection({ isActive }: JournauxSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [journals, setJournals] = useState<Journal[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    intitule: "",
    type: "OD",
  })

  // États pour afficher les écritures d'un journal
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loadingEntries, setLoadingEntries] = useState(false)
  const [showEntriesModal, setShowEntriesModal] = useState(false)

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadJournals()
    }
  }, [isActive])

  async function loadJournals() {
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

      // Load journals
      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .eq("company_id", companies[0].id)
        .order("code")

      if (error) {
        console.error("Error loading journals:", error)
      } else {
        setJournals(data || [])
      }
    } catch (error) {
      console.error("Error loading journals:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!companyId) {
      alert("Erreur: Aucune société trouvée. Veuillez recharger la page.")
      console.error("No companyId available")
      return
    }

    console.log("Submitting journal:", { companyId, formData })

    try {
      if (editingJournal) {
        // Update
        console.log("Updating journal:", editingJournal.id)
        const { error } = await supabase
          .from("journals")
          .update({
            code: formData.code,
            intitule: formData.intitule,
            type: formData.type,
          })
          .eq("id", editingJournal.id)

        if (error) {
          console.error("Update error:", error)
          throw error
        }
        alert("Journal modifié avec succès!")
      } else {
        // Create
        console.log("Creating journal with data:", {
          company_id: companyId,
          code: formData.code,
          intitule: formData.intitule,
          type: formData.type,
        })
        const { error } = await supabase.from("journals").insert({
          company_id: companyId,
          code: formData.code,
          intitule: formData.intitule,
          type: formData.type,
        })

        if (error) {
          console.error("Insert error:", error)
          throw error
        }
        alert("Journal créé avec succès!")
      }

      setShowAddModal(false)
      setEditingJournal(null)
      setFormData({ code: "", intitule: "", type: "OD" })
      await loadJournals()
    } catch (error: any) {
      console.error("Error saving journal:", error)
      alert("Erreur lors de la sauvegarde: " + error.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce journal ?")) return

    try {
      const { error } = await supabase.from("journals").delete().eq("id", id)

      if (error) throw error
      alert("Journal supprimé avec succès!")
      loadJournals()
    } catch (error: any) {
      console.error("Error deleting journal:", error)
      alert("Erreur: " + error.message)
    }
  }

  function openEditModal(journal: Journal) {
    setEditingJournal(journal)
    setFormData({
      code: journal.code,
      intitule: journal.intitule,
      type: journal.type,
    })
    setShowAddModal(true)
  }

  function closeModal() {
    setShowAddModal(false)
    setEditingJournal(null)
    setFormData({ code: "", intitule: "", type: "OD" })
  }

  async function loadJournalEntries(journal: Journal) {
    try {
      setLoadingEntries(true)
      setSelectedJournal(journal)
      setShowEntriesModal(true)

      if (!companyId) return

      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, date_ecriture, libelle, compte, s, montant, status, letter_code")
        .eq("company_id", companyId)
        .eq("journal_code", journal.code)
        .order("date_ecriture", { ascending: false })

      if (error) {
        console.error("Error loading entries:", error)
      } else {
        setJournalEntries(data || [])
      }
    } catch (error) {
      console.error("Error loading entries:", error)
    } finally {
      setLoadingEntries(false)
    }
  }

  function closeEntriesModal() {
    setShowEntriesModal(false)
    setSelectedJournal(null)
    setJournalEntries([])
  }

  // Calcul du total débit et crédit
  function calculateTotals() {
    let debit = 0
    let credit = 0
    journalEntries.forEach((entry) => {
      if (entry.s === "D") {
        debit += entry.montant
      } else {
        credit += entry.montant
      }
    })
    return { debit, credit, balance: debit - credit }
  }

  const journalTypeLabels: Record<string, string> = {
    ACHAT: "Achats",
    VENTE: "Ventes",
    BANQUE: "Banque",
    CAISSE: "Caisse",
    OD: "Opérations Diverses",
  }

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / JOURNAUX
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Journaux
            <br />
            <span className="text-muted-foreground">Comptables</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Les journaux regroupent vos écritures par nature d&apos;opération.
          </p>
        </header>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          + Créer un journal
        </button>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Chargement des journaux...</div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journals.map((journal) => (
              <div
                key={journal.id}
                onClick={() => loadJournalEntries(journal)}
                className="group glass p-8 rounded-lg hover:border-muted-foreground/50 transition-all duration-300 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-mono font-light">{journal.code}</div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(journal)
                        }}
                        className="px-3 py-1 text-sm border border-border rounded hover:bg-muted"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(journal.id)
                        }}
                        className="px-3 py-1 text-sm border border-destructive text-destructive rounded hover:bg-destructive/10"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-medium mb-2">{journal.intitule}</div>
                    <div className="text-sm text-muted-foreground">
                      Type: {journalTypeLabels[journal.type] || journal.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Créer/Modifier Journal */}
        <Modal isOpen={showAddModal} onClose={closeModal}>
          <div className="glass rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-light mb-6">
              {editingJournal ? "Modifier le journal" : "Nouveau journal"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  maxLength={10}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="AC, VT, BQ..."
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Intitulé *
                </label>
                <input
                  type="text"
                  value={formData.intitule}
                  onChange={(e) =>
                    setFormData({ ...formData, intitule: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Achats, Ventes..."
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="ACHAT">Achats</option>
                  <option value="VENTE">Ventes</option>
                  <option value="BANQUE">Banque</option>
                  <option value="CAISSE">Caisse</option>
                  <option value="OD">Opérations Diverses</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingJournal ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal Écritures du Journal */}
        <Modal isOpen={showEntriesModal} onClose={closeEntriesModal}>
          <div className="glass rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-light mb-2">
                Écritures du journal
              </h2>
              {selectedJournal && (
                <div className="space-y-1">
                  <div className="text-lg font-mono font-medium">
                    {selectedJournal.code} - {selectedJournal.intitule}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Type: {journalTypeLabels[selectedJournal.type]}</span>
                    <span>•</span>
                    <span>{journalEntries.length} écriture(s)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingEntries && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-muted-foreground">Chargement des écritures...</div>
                </div>
              )}

              {!loadingEntries && journalEntries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune écriture trouvée pour ce journal
                </div>
              )}

              {!loadingEntries && journalEntries.length > 0 && (
                <div className="space-y-2">
                  {/* En-tête du tableau */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Compte</div>
                    <div className="col-span-4">Libellé</div>
                    <div className="col-span-2 text-right">Débit</div>
                    <div className="col-span-2 text-right">Crédit</div>
                    <div className="col-span-1 text-center">Statut</div>
                  </div>

                  {/* Lignes des écritures */}
                  {journalEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors text-sm"
                    >
                      <div className="col-span-2 font-mono">
                        {formatDate(entry.date_ecriture)}
                      </div>
                      <div className="col-span-1 font-mono font-medium">
                        {entry.compte}
                      </div>
                      <div className="col-span-4">
                        <div>{entry.libelle}</div>
                        {entry.letter_code && (
                          <div className="text-xs text-muted-foreground">
                            Lettrage: {entry.letter_code}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 text-right font-mono">
                        {entry.s === "D" ? formatCurrency(entry.montant) : ""}
                      </div>
                      <div className="col-span-2 text-right font-mono">
                        {entry.s === "C" ? formatCurrency(entry.montant) : ""}
                      </div>
                      <div className="col-span-1 text-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            entry.status === "posted"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {entry.status === "posted" ? "Validé" : "Brouillard"}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 border-t-2 border-border font-medium text-sm mt-4">
                    <div className="col-span-7 text-right">Total:</div>
                    <div className="col-span-2 text-right font-mono">
                      {formatCurrency(
                        journalEntries
                          .filter((e) => e.s === "D")
                          .reduce((sum, e) => sum + e.montant, 0)
                      )}
                    </div>
                    <div className="col-span-2 text-right font-mono">
                      {formatCurrency(
                        journalEntries
                          .filter((e) => e.s === "C")
                          .reduce((sum, e) => sum + e.montant, 0)
                      )}
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Équilibre */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg font-medium">
                    <div className="col-span-7 text-right">Équilibre:</div>
                    <div className="col-span-4 text-right font-mono text-lg">
                      {formatCurrency(Math.abs(calculateTotals().balance))}
                      {calculateTotals().balance !== 0 && (
                        <span className="text-xs ml-2 text-destructive">
                          (Déséquilibré)
                        </span>
                      )}
                      {calculateTotals().balance === 0 && (
                        <span className="text-xs ml-2 text-green-500">
                          (Équilibré ✓)
                        </span>
                      )}
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={closeEntriesModal}
                className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

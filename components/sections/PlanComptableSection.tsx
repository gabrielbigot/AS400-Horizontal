"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Modal } from "@/components/ui/modal"
import { formatCurrency, formatDate } from "@/lib/utils"
import { VirtualizedList } from "@/components/ui/virtualized-list"

interface PlanComptableSectionProps {
  isActive: boolean
}

interface Account {
  id: string
  numero: string
  intitule: string
  type: string
}

interface JournalEntry {
  id: string
  date_ecriture: string
  libelle: string
  journal_code: string
  s: 'D' | 'C'
  montant: number
  status: string
  letter_code?: string
}

export function PlanComptableSection({ isActive }: PlanComptableSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({
    numero: "",
    intitule: "",
    type: "ACTIF",
  })

  // États pour afficher les écritures d'un compte
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [accountEntries, setAccountEntries] = useState<JournalEntry[]>([])
  const [loadingEntries, setLoadingEntries] = useState(false)
  const [showEntriesModal, setShowEntriesModal] = useState(false)

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadAccounts()
    }
  }, [isActive])

  async function loadAccounts() {
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

      // Load accounts
      const { data, error } = await supabase
        .from("accounts")
        .select("id, numero, intitule, type")
        .eq("company_id", companies[0].id)
        .order("numero")

      if (error) {
        console.error("Error loading accounts:", error)
      } else {
        setAccounts(data || [])
      }
    } catch (error) {
      console.error("Error loading accounts:", error)
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

    console.log("Submitting account:", { companyId, formData })

    try {
      if (editingAccount) {
        // Update
        console.log("Updating account:", editingAccount.id)
        const { error } = await supabase
          .from("accounts")
          .update({
            numero: formData.numero,
            intitule: formData.intitule,
            type: formData.type,
          })
          .eq("id", editingAccount.id)

        if (error) {
          console.error("Update error:", error)
          throw error
        }
        alert("Compte modifié avec succès!")
      } else {
        // Create
        console.log("Creating account with data:", {
          company_id: companyId,
          numero: formData.numero,
          intitule: formData.intitule,
          type: formData.type,
        })
        const { error } = await supabase.from("accounts").insert({
          company_id: companyId,
          numero: formData.numero,
          intitule: formData.intitule,
          type: formData.type,
        })

        if (error) {
          console.error("Insert error:", error)
          throw error
        }
        alert("Compte créé avec succès!")
      }

      setShowAddModal(false)
      setEditingAccount(null)
      setFormData({ numero: "", intitule: "", type: "ACTIF" })
      await loadAccounts()
    } catch (error: any) {
      console.error("Error saving account:", error)
      alert("Erreur lors de la sauvegarde: " + error.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) return

    try {
      const { error } = await supabase.from("accounts").delete().eq("id", id)

      if (error) throw error
      alert("Compte supprimé avec succès!")
      loadAccounts()
    } catch (error: any) {
      console.error("Error deleting account:", error)
      alert("Erreur: " + error.message)
    }
  }

  function openEditModal(account: Account) {
    setEditingAccount(account)
    setFormData({
      numero: account.numero,
      intitule: account.intitule,
      type: account.type,
    })
    setShowAddModal(true)
  }

  function closeModal() {
    setShowAddModal(false)
    setEditingAccount(null)
    setFormData({ numero: "", intitule: "", type: "ACTIF" })
  }

  async function loadAccountEntries(account: Account) {
    try {
      setLoadingEntries(true)
      setSelectedAccount(account)
      setShowEntriesModal(true)

      if (!companyId) return

      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, date_ecriture, libelle, journal_code, s, montant, status, letter_code")
        .eq("company_id", companyId)
        .eq("compte", account.numero)
        .order("date_ecriture", { ascending: false })

      if (error) {
        console.error("Error loading entries:", error)
      } else {
        setAccountEntries(data || [])
      }
    } catch (error) {
      console.error("Error loading entries:", error)
    } finally {
      setLoadingEntries(false)
    }
  }

  function closeEntriesModal() {
    setShowEntriesModal(false)
    setSelectedAccount(null)
    setAccountEntries([])
  }

  // Calcul du solde cumulé
  function calculateBalance() {
    let balance = 0
    accountEntries.forEach((entry) => {
      if (entry.s === "D") {
        balance += entry.montant
      } else {
        balance -= entry.montant
      }
    })
    return balance
  }

  const filteredComptes = accounts.filter(
    (compte) =>
      compte.numero.includes(searchTerm) ||
      compte.intitule.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / PLAN COMPTABLE
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Plan
            <br />
            <span className="text-muted-foreground">Comptable</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Gérez vos comptes comptables. Consultez, ajoutez, modifiez ou supprimez des comptes.
          </p>
        </header>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un compte (numéro ou libellé)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            + Nouveau compte
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Chargement des comptes...</div>
          </div>
        )}

        {!loading && (
          <>
            {/* Liste des comptes */}
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {filteredComptes.length} compte(s) trouvé(s)
              </div>
              {filteredComptes.length > 10 ? (
                <VirtualizedList
                  items={filteredComptes}
                  height={600}
                  itemHeight={100}
                  renderItem={(compte) => (
                    <div
                      key={compte.id}
                      onClick={() => loadAccountEntries(compte)}
                      className="group border border-border rounded-lg p-6 hover:border-muted-foreground/50 transition-all duration-300 cursor-pointer mb-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-mono font-medium">{compte.numero}</div>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {compte.type}
                            </span>
                          </div>
                          <div className="text-muted-foreground">{compte.intitule}</div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditModal(compte)
                            }}
                            className="px-3 py-1 text-sm border border-border rounded hover:bg-muted"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(compte.id)
                            }}
                            className="px-3 py-1 text-sm border border-destructive text-destructive rounded hover:bg-destructive/10"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div className="space-y-2">
                  {filteredComptes.map((compte) => (
                    <div
                      key={compte.id}
                      onClick={() => loadAccountEntries(compte)}
                      className="group border border-border rounded-lg p-6 hover:border-muted-foreground/50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-mono font-medium">{compte.numero}</div>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {compte.type}
                            </span>
                          </div>
                          <div className="text-muted-foreground">{compte.intitule}</div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditModal(compte)
                            }}
                            className="px-3 py-1 text-sm border border-border rounded hover:bg-muted"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(compte.id)
                            }}
                            className="px-3 py-1 text-sm border border-destructive text-destructive rounded hover:bg-destructive/10"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal Créer/Modifier Compte */}
        <Modal isOpen={showAddModal} onClose={closeModal}>
          <div className="glass rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-light mb-6">
              {editingAccount ? "Modifier le compte" : "Nouveau compte"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Numéro de compte *
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) =>
                    setFormData({ ...formData, numero: e.target.value })
                  }
                  pattern="[0-9]+"
                  maxLength={6}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="401000, 512000..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  6 chiffres uniquement
                </p>
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
                  placeholder="Fournisseurs, Banque..."
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
                  <option value="ACTIF">Actif</option>
                  <option value="PASSIF">Passif</option>
                  <option value="CHARGE">Charge</option>
                  <option value="PRODUIT">Produit</option>
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
                  {editingAccount ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal Écritures du Compte */}
        <Modal isOpen={showEntriesModal} onClose={closeEntriesModal}>
          <div className="glass rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-light mb-2">
                Écritures du compte
              </h2>
              {selectedAccount && (
                <div className="space-y-1">
                  <div className="text-lg font-mono font-medium">
                    {selectedAccount.numero} - {selectedAccount.intitule}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Type: {selectedAccount.type}</span>
                    <span>•</span>
                    <span>{accountEntries.length} écriture(s)</span>
                    <span>•</span>
                    <span>Solde: {formatCurrency(calculateBalance())}</span>
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

              {!loadingEntries && accountEntries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune écriture trouvée pour ce compte
                </div>
              )}

              {!loadingEntries && accountEntries.length > 0 && (
                <div className="space-y-2">
                  {/* En-tête du tableau */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Journal</div>
                    <div className="col-span-4">Libellé</div>
                    <div className="col-span-2 text-right">Débit</div>
                    <div className="col-span-2 text-right">Crédit</div>
                    <div className="col-span-1 text-center">Statut</div>
                  </div>

                  {/* Lignes des écritures */}
                  {accountEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors text-sm"
                    >
                      <div className="col-span-2 font-mono">
                        {formatDate(entry.date_ecriture)}
                      </div>
                      <div className="col-span-1 font-mono font-medium">
                        {entry.journal_code}
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
                        accountEntries
                          .filter((e) => e.s === "D")
                          .reduce((sum, e) => sum + e.montant, 0)
                      )}
                    </div>
                    <div className="col-span-2 text-right font-mono">
                      {formatCurrency(
                        accountEntries
                          .filter((e) => e.s === "C")
                          .reduce((sum, e) => sum + e.montant, 0)
                      )}
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Solde */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg font-medium">
                    <div className="col-span-7 text-right">Solde du compte:</div>
                    <div className="col-span-4 text-right font-mono text-lg">
                      {formatCurrency(calculateBalance())}
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

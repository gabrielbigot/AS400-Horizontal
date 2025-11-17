"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { formatCurrency, formatDate } from "@/lib/utils"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface RapportsSectionProps {
  isActive: boolean
}

interface BalanceLine {
  numero: string
  intitule: string
  debit: number
  credit: number
  solde: number
}

interface GrandLivreAccount {
  numero: string
  intitule: string
  entries: GrandLivreEntry[]
  debitTotal: number
  creditTotal: number
  solde: number
}

interface GrandLivreEntry {
  id: string
  date_ecriture: string
  libelle: string
  journal_code: string
  s: 'D' | 'C'
  montant: number
}

interface TVALine {
  label: string
  montant: number
}

export function RapportsSection({ isActive }: RapportsSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [activeReport, setActiveReport] = useState<string | null>(null)
  const [balanceData, setBalanceData] = useState<BalanceLine[]>([])
  const [grandLivreData, setGrandLivreData] = useState<GrandLivreAccount[]>([])
  const [tvaData, setTvaData] = useState<TVALine[]>([])

  // Filtres de date
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadCompany()
    }
  }, [isActive])

  async function loadCompany() {
    const { data: companies } = await supabase
      .from("companies")
      .select("id")
      .limit(1)

    if (companies && companies.length > 0) {
      setCompanyId(companies[0].id)
    }
  }

  async function generateBalance() {
    if (!companyId) return

    try {
      setLoading(true)
      setActiveReport("balance")

      // Load all accounts
      const { data: accounts } = await supabase
        .from("accounts")
        .select("numero, intitule")
        .eq("company_id", companyId)
        .order("numero")

      // Load all posted entries
      const { data: entries } = await supabase
        .from("journal_entries")
        .select("compte, s, montant")
        .eq("company_id", companyId)
        .eq("status", "posted")

      // Calculate balances
      const balanceMap = new Map<string, BalanceLine>()

      // Initialize with accounts
      accounts?.forEach((account) => {
        balanceMap.set(account.numero, {
          numero: account.numero,
          intitule: account.intitule,
          debit: 0,
          credit: 0,
          solde: 0,
        })
      })

      // Add entries
      entries?.forEach((entry) => {
        let balance = balanceMap.get(entry.compte)
        if (!balance) {
          balance = {
            numero: entry.compte,
            intitule: "Compte non référencé",
            debit: 0,
            credit: 0,
            solde: 0,
          }
          balanceMap.set(entry.compte, balance)
        }

        if (entry.s === "D") {
          balance.debit += entry.montant
        } else {
          balance.credit += entry.montant
        }
      })

      // Calculate solde
      const balanceArray: BalanceLine[] = []
      balanceMap.forEach((balance) => {
        balance.solde = balance.debit - balance.credit
        if (balance.debit !== 0 || balance.credit !== 0) {
          balanceArray.push(balance)
        }
      })

      setBalanceData(balanceArray)
    } catch (error) {
      console.error("Error generating balance:", error)
      alert("Erreur lors de la génération de la balance")
    } finally {
      setLoading(false)
    }
  }

  async function generateGrandLivre() {
    if (!companyId) return

    try {
      setLoading(true)
      setActiveReport("grand-livre")

      // Load accounts
      const { data: accounts } = await supabase
        .from("accounts")
        .select("numero, intitule")
        .eq("company_id", companyId)
        .order("numero")

      // Load all posted entries with filters
      let query = supabase
        .from("journal_entries")
        .select("id, date_ecriture, libelle, journal_code, compte, s, montant")
        .eq("company_id", companyId)
        .eq("status", "posted")
        .order("compte")
        .order("date_ecriture")

      if (dateStart) {
        query = query.gte("date_ecriture", dateStart)
      }
      if (dateEnd) {
        query = query.lte("date_ecriture", dateEnd)
      }

      const { data: entries } = await query

      // Group entries by account
      const accountMap = new Map<string, GrandLivreAccount>()

      accounts?.forEach((account) => {
        accountMap.set(account.numero, {
          numero: account.numero,
          intitule: account.intitule,
          entries: [],
          debitTotal: 0,
          creditTotal: 0,
          solde: 0,
        })
      })

      entries?.forEach((entry) => {
        let account = accountMap.get(entry.compte)
        if (!account) {
          account = {
            numero: entry.compte,
            intitule: "Compte non référencé",
            entries: [],
            debitTotal: 0,
            creditTotal: 0,
            solde: 0,
          }
          accountMap.set(entry.compte, account)
        }

        account.entries.push({
          id: entry.id,
          date_ecriture: entry.date_ecriture,
          libelle: entry.libelle,
          journal_code: entry.journal_code,
          s: entry.s,
          montant: entry.montant,
        })

        if (entry.s === "D") {
          account.debitTotal += entry.montant
        } else {
          account.creditTotal += entry.montant
        }
      })

      // Calculate solde and filter accounts with movements
      const grandLivreArray: GrandLivreAccount[] = []
      accountMap.forEach((account) => {
        if (account.entries.length > 0) {
          account.solde = account.debitTotal - account.creditTotal
          grandLivreArray.push(account)
        }
      })

      setGrandLivreData(grandLivreArray)
    } catch (error) {
      console.error("Error generating grand livre:", error)
      alert("Erreur lors de la génération du grand livre")
    } finally {
      setLoading(false)
    }
  }

  async function generateTVA() {
    if (!companyId) return

    try {
      setLoading(true)
      setActiveReport("tva")

      // Load TVA entries
      let query = supabase
        .from("journal_entries")
        .select("compte, s, montant")
        .eq("company_id", companyId)
        .eq("status", "posted")

      if (dateStart) {
        query = query.gte("date_ecriture", dateStart)
      }
      if (dateEnd) {
        query = query.lte("date_ecriture", dateEnd)
      }

      const { data: entries } = await query

      let tvaCollectee = 0
      let tvaDeductible = 0

      entries?.forEach((entry) => {
        // TVA collectée (compte 445710)
        if (entry.compte === "445710") {
          if (entry.s === "C") {
            tvaCollectee += entry.montant
          } else {
            tvaCollectee -= entry.montant
          }
        }
        // TVA déductible (compte 445660)
        if (entry.compte === "445660") {
          if (entry.s === "D") {
            tvaDeductible += entry.montant
          } else {
            tvaDeductible -= entry.montant
          }
        }
      })

      const tvaPayer = tvaCollectee - tvaDeductible

      setTvaData([
        { label: "TVA Collectée", montant: tvaCollectee },
        { label: "TVA Déductible", montant: tvaDeductible },
        { label: "TVA à payer", montant: tvaPayer },
      ])
    } catch (error) {
      console.error("Error generating TVA:", error)
      alert("Erreur lors de la génération du rapport TVA")
    } finally {
      setLoading(false)
    }
  }

  async function exportToCSV() {
    if (activeReport === "balance" && balanceData.length > 0) {
      const csv = [
        ["Numéro", "Intitulé", "Débit", "Crédit", "Solde"].join(";"),
        ...balanceData.map((line) =>
          [
            line.numero,
            line.intitule,
            line.debit.toFixed(2),
            line.credit.toFixed(2),
            line.solde.toFixed(2),
          ].join(";")
        ),
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `balance-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  function printReport() {
    window.print()
  }

  function exportToPDF() {
    if (activeReport === "balance") {
      exportBalanceToPDF()
    } else if (activeReport === "grand-livre") {
      exportGrandLivreToPDF()
    } else if (activeReport === "tva") {
      exportTVAToPDF()
    }
  }

  function exportBalanceToPDF() {
    if (balanceData.length === 0) return

    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.text("Balance des Comptes", 14, 20)

    doc.setFontSize(10)
    doc.text(`Date d'édition: ${formatDate(new Date())}`, 14, 28)

    if (dateStart || dateEnd) {
      const periode = `Période: ${dateStart ? formatDate(new Date(dateStart)) : "Début"} - ${
        dateEnd ? formatDate(new Date(dateEnd)) : "Fin"
      }`
      doc.text(periode, 14, 34)
    }

    // Table
    autoTable(doc, {
      startY: dateStart || dateEnd ? 40 : 35,
      head: [['Compte', 'Intitulé', 'Débit', 'Crédit', 'Solde']],
      body: balanceData.map((line) => [
        line.numero,
        line.intitule,
        formatCurrency(line.debit),
        formatCurrency(line.credit),
        formatCurrency(line.solde),
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [71, 85, 105],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
      },
    })

    // Totals
    const totalDebit = balanceData.reduce((sum, line) => sum + line.debit, 0)
    const totalCredit = balanceData.reduce((sum, line) => sum + line.credit, 0)

    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Débit: ${formatCurrency(totalDebit)}`, 14, finalY)
    doc.text(`Total Crédit: ${formatCurrency(totalCredit)}`, 14, finalY + 7)
    doc.text(`Différence: ${formatCurrency(totalDebit - totalCredit)}`, 14, finalY + 14)

    doc.save(`balance-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  function exportGrandLivreToPDF() {
    if (grandLivreData.length === 0) return

    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.text("Grand Livre", 14, 20)

    doc.setFontSize(10)
    doc.text(`Date d'édition: ${formatDate(new Date())}`, 14, 28)

    if (dateStart || dateEnd) {
      const periode = `Période: ${dateStart ? formatDate(new Date(dateStart)) : "Début"} - ${
        dateEnd ? formatDate(new Date(dateEnd)) : "Fin"
      }`
      doc.text(periode, 14, 34)
    }

    let currentY = dateStart || dateEnd ? 42 : 37

    grandLivreData.forEach((account, index) => {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }

      // Account header
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`${account.numero} - ${account.intitule}`, 14, currentY)
      currentY += 7

      // Entries table
      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Journal', 'Libellé', 'Débit', 'Crédit']],
        body: account.entries.map((entry) => [
          formatDate(new Date(entry.date_ecriture)),
          entry.journal_code,
          entry.libelle,
          entry.s === 'D' ? formatCurrency(entry.montant) : '',
          entry.s === 'C' ? formatCurrency(entry.montant) : '',
        ]),
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
        },
        headStyles: {
          fillColor: [100, 116, 139],
          textColor: 255,
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 18 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 25, halign: 'right' },
        },
      })

      currentY = (doc as any).lastAutoTable.finalY + 3

      // Account totals
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(
        `Total: Débit ${formatCurrency(account.debitTotal)} | Crédit ${formatCurrency(
          account.creditTotal
        )} | Solde ${formatCurrency(account.solde)}`,
        14,
        currentY
      )
      currentY += 10
    })

    doc.save(`grand-livre-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  function exportTVAToPDF() {
    if (tvaData.length === 0) return

    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.text("Déclaration TVA (CA3)", 14, 20)

    doc.setFontSize(10)
    doc.text(`Date d'édition: ${formatDate(new Date())}`, 14, 28)

    if (dateStart || dateEnd) {
      const periode = `Période: ${dateStart ? formatDate(new Date(dateStart)) : "Début"} - ${
        dateEnd ? formatDate(new Date(dateEnd)) : "Fin"
      }`
      doc.text(periode, 14, 34)
    }

    // Table
    autoTable(doc, {
      startY: dateStart || dateEnd ? 42 : 37,
      head: [['Libellé', 'Montant']],
      body: tvaData.map((line) => [line.label, formatCurrency(line.montant)]),
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [71, 85, 105],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 12,
      },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold' },
        1: { cellWidth: 50, halign: 'right', fontSize: 12 },
      },
      didParseCell: function (data) {
        if (data.row.index === 2) {
          // TVA à payer row
          data.cell.styles.fillColor = tvaData[2].montant >= 0 ? [220, 252, 231] : [254, 226, 226]
          data.cell.styles.textColor = tvaData[2].montant >= 0 ? [22, 101, 52] : [127, 29, 29]
          data.cell.styles.fontStyle = 'bold'
        }
      },
    })

    // Note
    const finalY = (doc as any).lastAutoTable.finalY + 15
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    doc.text("TVA Collectée : Compte 445710", 14, finalY)
    doc.text("TVA Déductible : Compte 445660", 14, finalY + 6)

    doc.save(`tva-ca3-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const rapports = [
    {
      id: "balance",
      nom: "Balance des comptes",
      description: "Liste de tous les comptes avec totaux Débit, Crédit et Solde",
      icon: "📊",
      action: generateBalance,
    },
    {
      id: "grand-livre",
      nom: "Grand Livre",
      description: "Détail de tous les mouvements de chaque compte",
      icon: "📖",
      action: generateGrandLivre,
    },
    {
      id: "tva",
      nom: "Déclaration TVA (CA3)",
      description: "TVA collectée, déductible et à payer",
      icon: "💶",
      action: generateTVA,
    },
    {
      id: "fec",
      nom: "Fichier FEC",
      description: "Export normalisé pour l'administration fiscale",
      icon: "📄",
      action: () => alert("Fonctionnalité à venir"),
    },
  ]

  const totalDebit = balanceData.reduce((sum, line) => sum + line.debit, 0)
  const totalCredit = balanceData.reduce((sum, line) => sum + line.credit, 0)

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / RAPPORTS
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Rapports &
            <br />
            <span className="text-muted-foreground">Éditions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Générez vos rapports comptables légaux et de gestion.
          </p>
        </header>

        {!activeReport && (
          <>
            {/* Filtres de date */}
            <div className="glass p-6 rounded-lg space-y-4">
              <h3 className="text-sm font-medium">Filtres (optionnels)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              {(dateStart || dateEnd) && (
                <button
                  onClick={() => {
                    setDateStart("")
                    setDateEnd("")
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rapports.map((rapport) => (
              <div
                key={rapport.id}
                className="group glass p-8 rounded-lg hover:border-muted-foreground/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="text-4xl">{rapport.icon}</div>
                  <div>
                    <h3 className="text-xl font-medium mb-2 group-hover:text-muted-foreground transition-colors">
                      {rapport.nom}
                    </h3>
                    <p className="text-sm text-muted-foreground">{rapport.description}</p>
                  </div>
                  <button
                    onClick={rapport.action}
                    disabled={loading}
                    className="w-full py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm disabled:opacity-50"
                  >
                    {loading ? "Génération..." : "Générer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {activeReport === "balance" && balanceData.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light">Balance des comptes</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  📄 Exporter PDF
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Exporter CSV
                </button>
                <button
                  onClick={printReport}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Imprimer
                </button>
                <button
                  onClick={() => {
                    setActiveReport(null)
                    setBalanceData([])
                  }}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>

            <div className="glass rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-sm font-mono text-muted-foreground">
                      <th className="text-left p-4">Compte</th>
                      <th className="text-left p-4">Intitulé</th>
                      <th className="text-right p-4">Débit</th>
                      <th className="text-right p-4">Crédit</th>
                      <th className="text-right p-4">Solde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balanceData.map((line) => (
                      <tr key={line.numero} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="p-4 font-mono text-sm">{line.numero}</td>
                        <td className="p-4 text-sm">{line.intitule}</td>
                        <td className="p-4 text-right font-mono text-sm">
                          {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                        </td>
                        <td className="p-4 text-right font-mono text-sm">
                          {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                        </td>
                        <td className="p-4 text-right font-mono text-sm">
                          <span className={line.solde >= 0 ? "text-green-500" : "text-red-500"}>
                            {formatCurrency(Math.abs(line.solde))}
                            {line.solde < 0 ? " C" : " D"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-border bg-muted/30">
                    <tr className="font-medium">
                      <td className="p-4" colSpan={2}>
                        TOTAUX
                      </td>
                      <td className="p-4 text-right font-mono">{formatCurrency(totalDebit)}</td>
                      <td className="p-4 text-right font-mono">{formatCurrency(totalCredit)}</td>
                      <td className="p-4 text-right font-mono">
                        {formatCurrency(Math.abs(totalDebit - totalCredit))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Grand Livre */}
        {activeReport === "grand-livre" && grandLivreData.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light">Grand Livre</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  📄 Exporter PDF
                </button>
                <button
                  onClick={printReport}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Imprimer
                </button>
                <button
                  onClick={() => {
                    setActiveReport(null)
                    setGrandLivreData([])
                  }}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {grandLivreData.map((account) => (
                <div key={account.numero} className="glass rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <div className="text-lg font-mono font-medium">
                        {account.numero} - {account.intitule}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {account.entries.length} mouvement(s)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Solde</div>
                      <div className={`text-lg font-mono font-medium ${
                        account.solde >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {formatCurrency(Math.abs(account.solde))}
                        {account.solde < 0 ? " C" : " D"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                      <div className="col-span-2">Date</div>
                      <div className="col-span-1">Journal</div>
                      <div className="col-span-5">Libellé</div>
                      <div className="col-span-2 text-right">Débit</div>
                      <div className="col-span-2 text-right">Crédit</div>
                    </div>

                    {/* Entries */}
                    {account.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="grid grid-cols-12 gap-4 px-4 py-2 text-sm hover:bg-muted/30 rounded"
                      >
                        <div className="col-span-2 font-mono text-xs">
                          {formatDate(entry.date_ecriture)}
                        </div>
                        <div className="col-span-1 font-mono font-medium text-xs">
                          {entry.journal_code}
                        </div>
                        <div className="col-span-5 text-xs">{entry.libelle}</div>
                        <div className="col-span-2 text-right font-mono text-xs">
                          {entry.s === "D" ? formatCurrency(entry.montant) : "-"}
                        </div>
                        <div className="col-span-2 text-right font-mono text-xs">
                          {entry.s === "C" ? formatCurrency(entry.montant) : "-"}
                        </div>
                      </div>
                    ))}

                    {/* Totals */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium border-t border-border bg-muted/30">
                      <div className="col-span-8 text-right">Total:</div>
                      <div className="col-span-2 text-right font-mono">
                        {formatCurrency(account.debitTotal)}
                      </div>
                      <div className="col-span-2 text-right font-mono">
                        {formatCurrency(account.creditTotal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rapport TVA */}
        {activeReport === "tva" && tvaData.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light">Déclaration TVA (CA3)</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  📄 Exporter PDF
                </button>
                <button
                  onClick={printReport}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Imprimer
                </button>
                <button
                  onClick={() => {
                    setActiveReport(null)
                    setTvaData([])
                  }}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>

            {(dateStart || dateEnd) && (
              <div className="glass p-4 rounded-lg text-sm">
                <span className="text-muted-foreground">Période: </span>
                {dateStart && <span>du {formatDate(dateStart)} </span>}
                {dateEnd && <span>au {formatDate(dateEnd)}</span>}
                {!dateStart && !dateEnd && <span>Toutes les dates</span>}
              </div>
            )}

            <div className="glass rounded-lg p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center pb-4 border-b border-border">
                <h3 className="text-xl font-medium">Résumé TVA</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Calcul basé sur les comptes 445660 (TVA déductible) et 445710 (TVA collectée)
                </p>
              </div>

              {tvaData.map((line) => (
                <div
                  key={line.label}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    line.label.includes("payer")
                      ? "bg-primary/10 border border-primary"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="font-medium">{line.label}</div>
                  <div className={`text-lg font-mono font-medium ${
                    line.label.includes("payer")
                      ? line.montant >= 0
                        ? "text-red-500"
                        : "text-green-500"
                      : ""
                  }`}>
                    {formatCurrency(Math.abs(line.montant))}
                    {line.label.includes("payer") && (
                      <span className="text-xs ml-2">
                        {line.montant >= 0 ? "(à payer)" : "(crédit)"}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                Ce rapport est fourni à titre indicatif. Veuillez vérifier avec votre expert-comptable.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

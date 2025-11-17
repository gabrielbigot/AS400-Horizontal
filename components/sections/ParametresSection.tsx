"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface ParametresSectionProps {
  isActive: boolean
}

interface CompanyData {
  name: string
  siret: string
  address: string
  email: string
  phone: string
}

interface SettingsData {
  fiscal_year_start: string
  fiscal_year_end: string
  vat_regime: string
  accounting_plan: string
}

export function ParametresSection({ isActive }: ParametresSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [settingsId, setSettingsId] = useState<string | null>(null)

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    siret: "",
    address: "",
    email: "",
    phone: "",
  })

  const [settingsData, setSettingsData] = useState<SettingsData>({
    fiscal_year_start: "",
    fiscal_year_end: "",
    vat_regime: "NORMAL",
    accounting_plan: "PCG",
  })

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      loadData()
    }
  }, [isActive])

  async function loadData() {
    try {
      setLoading(true)

      // Load company
      const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .limit(1)

      if (companies && companies.length > 0) {
        const company = companies[0]
        setCompanyId(company.id)
        setCompanyData({
          name: company.name || "",
          siret: company.siret || "",
          address: company.address || "",
          email: company.email || "",
          phone: company.phone || "",
        })

        // Load settings
        const { data: settings } = await supabase
          .from("company_settings")
          .select("*")
          .eq("company_id", company.id)
          .limit(1)

        if (settings && settings.length > 0) {
          const setting = settings[0]
          setSettingsId(setting.id)
          setSettingsData({
            fiscal_year_start: setting.fiscal_year_start || "",
            fiscal_year_end: setting.fiscal_year_end || "",
            vat_regime: setting.vat_regime || "NORMAL",
            accounting_plan: setting.accounting_plan || "PCG",
          })
        }
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!companyId) return

    try {
      setSaving(true)

      // Update company
      const { error: companyError } = await supabase
        .from("companies")
        .update({
          name: companyData.name,
          siret: companyData.siret,
          address: companyData.address,
          email: companyData.email,
          phone: companyData.phone,
        })
        .eq("id", companyId)

      if (companyError) throw companyError

      // Update or create settings
      if (settingsId) {
        const { error: settingsError } = await supabase
          .from("company_settings")
          .update({
            fiscal_year_start: settingsData.fiscal_year_start,
            fiscal_year_end: settingsData.fiscal_year_end,
            vat_regime: settingsData.vat_regime,
            accounting_plan: settingsData.accounting_plan,
          })
          .eq("id", settingsId)

        if (settingsError) throw settingsError
      } else {
        const { error: settingsError } = await supabase
          .from("company_settings")
          .insert({
            company_id: companyId,
            fiscal_year_start: settingsData.fiscal_year_start,
            fiscal_year_end: settingsData.fiscal_year_end,
            vat_regime: settingsData.vat_regime,
            accounting_plan: settingsData.accounting_plan,
          })

        if (settingsError) throw settingsError
      }

      alert("Paramètres enregistrés avec succès!")
    } catch (error: any) {
      console.error("Error saving settings:", error)
      alert("Erreur lors de l'enregistrement: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
        <div className="max-w-7xl mx-auto flex justify-center items-center py-12">
          <div className="text-muted-foreground">Chargement des paramètres...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / PARAMÈTRES
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight">
            Paramètres de
            <br />
            <span className="text-muted-foreground">Comptabilité</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Configurez votre exercice comptable et les informations de votre structure.
          </p>
        </header>

        <div className="space-y-6">
          {/* Exercice Comptable */}
          <div className="glass p-8 rounded-lg space-y-6">
            <h2 className="text-2xl font-light">Exercice Comptable</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Date de début</label>
                <input
                  type="date"
                  value={settingsData.fiscal_year_start}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, fiscal_year_start: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Date de fin</label>
                <input
                  type="date"
                  value={settingsData.fiscal_year_end}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, fiscal_year_end: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Régime TVA</label>
                <select
                  value={settingsData.vat_regime}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, vat_regime: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="SIMPLIFIE">Simplifié</option>
                  <option value="FRANCHISE">Franchise de base</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Plan comptable</label>
                <select
                  value={settingsData.accounting_plan}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, accounting_plan: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="PCG">Plan Comptable Général (PCG)</option>
                  <option value="ASSOCIATION">Plan des Associations</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informations de la structure */}
          <div className="glass p-8 rounded-lg space-y-6">
            <h2 className="text-2xl font-light">Informations de la Structure</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="TAC Hockey Club"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">SIRET</label>
                  <input
                    type="text"
                    value={companyData.siret}
                    onChange={(e) => setCompanyData({ ...companyData, siret: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="123 456 789 00012"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="contact@tachockey.fr"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Adresse</label>
                  <input
                    type="text"
                    value={companyData.address}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="12 rue du Stade, 62520 Le Touquet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Téléphone</label>
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="03 21 XX XX XX"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </button>
        </div>
      </div>
    </div>
  )
}

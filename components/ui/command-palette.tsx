"use client"

import { useEffect, useState, useMemo } from "react"
import { Command, Search, FileText, BookOpen, Calculator, PieChart, Settings, Sparkles } from "lucide-react"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"

interface CommandItem {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  section?: string
  keywords?: string[]
  action: () => void
}

interface CommandPaletteProps {
  sections: string[]
  onNavigateToSection: (index: number) => void
}

export function CommandPalette({ sections, onNavigateToSection }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Define all available commands
  const commands: CommandItem[] = useMemo(() => [
    {
      id: "dashboard",
      title: "Tableau de Bord",
      description: "Vue d'ensemble de la comptabilité",
      icon: <PieChart className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["dashboard", "tableau", "bord", "overview"],
      action: () => {
        onNavigateToSection(0)
        setIsOpen(false)
      }
    },
    {
      id: "plan-comptable",
      title: "Plan Comptable",
      description: "Gérer les comptes comptables",
      icon: <BookOpen className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["plan", "comptable", "comptes", "accounts"],
      action: () => {
        onNavigateToSection(1)
        setIsOpen(false)
      }
    },
    {
      id: "journaux",
      title: "Journaux",
      description: "Configuration des journaux",
      icon: <FileText className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["journaux", "journals", "configuration"],
      action: () => {
        onNavigateToSection(2)
        setIsOpen(false)
      }
    },
    {
      id: "ecritures",
      title: "Écritures",
      description: "Saisir des opérations comptables",
      icon: <Calculator className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["écritures", "entries", "saisie", "operations"],
      action: () => {
        onNavigateToSection(3)
        setIsOpen(false)
      }
    },
    {
      id: "brouillard",
      title: "Brouillard",
      description: "Valider les écritures en attente",
      icon: <FileText className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["brouillard", "draft", "validation"],
      action: () => {
        onNavigateToSection(4)
        setIsOpen(false)
      }
    },
    {
      id: "lettrage",
      title: "Lettrage",
      description: "Rapprocher les écritures",
      icon: <FileText className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["lettrage", "reconciliation", "rapprochement"],
      action: () => {
        onNavigateToSection(5)
        setIsOpen(false)
      }
    },
    {
      id: "rapports",
      title: "Rapports",
      description: "Consulter les rapports comptables",
      icon: <FileText className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["rapports", "reports", "balance", "grand livre"],
      action: () => {
        onNavigateToSection(6)
        setIsOpen(false)
      }
    },
    {
      id: "parametres",
      title: "Paramètres",
      description: "Configuration de l'application",
      icon: <Settings className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["paramètres", "settings", "configuration"],
      action: () => {
        onNavigateToSection(7)
        setIsOpen(false)
      }
    },
    {
      id: "assistant",
      title: "Assistant IA",
      description: "Poser des questions à l'assistant",
      icon: <Sparkles className="w-4 h-4" />,
      section: "Navigation",
      keywords: ["assistant", "ia", "ai", "aide", "help"],
      action: () => {
        onNavigateToSection(8)
        setIsOpen(false)
      }
    }
  ], [onNavigateToSection])

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) return commands

    const searchLower = search.toLowerCase()
    return commands.filter((cmd) => {
      const titleMatch = cmd.title.toLowerCase().includes(searchLower)
      const descMatch = cmd.description?.toLowerCase().includes(searchLower)
      const keywordMatch = cmd.keywords?.some((k) => k.includes(searchLower))
      return titleMatch || descMatch || keywordMatch
    })
  }, [search, commands])

  // Group commands by section
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.forEach((cmd) => {
      const section = cmd.section || "Autres"
      if (!groups[section]) groups[section] = []
      groups[section].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      callback: () => setIsOpen((prev) => !prev),
      description: 'Open command palette'
    },
    {
      key: 'Escape',
      callback: () => {
        if (isOpen) {
          setIsOpen(false)
          setSearch("")
        }
      },
      description: 'Close command palette'
    }
  ])

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearch("")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/3 w-full max-w-2xl z-50 animate-slide-in-left">
        <div className="glass rounded-lg shadow-2xl border border-border overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une section ou une action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 text-xs bg-muted rounded border border-border">Ctrl</kbd>
              <kbd className="px-2 py-1 text-xs bg-muted rounded border border-border">K</kbd>
            </div>
          </div>

          {/* Command List */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucun résultat trouvé pour &quot;{search}&quot;
              </div>
            ) : (
              Object.entries(groupedCommands).map(([section, items]) => (
                <div key={section} className="mb-4">
                  <div className="px-3 py-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {section}
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 text-left group"
                      >
                        {item.icon && (
                          <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                            {item.icon}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <Command className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">↓</kbd>
                <span className="ml-1">naviguer</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">↵</kbd>
                <span className="ml-1">sélectionner</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">Esc</kbd>
              <span className="ml-1">fermer</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

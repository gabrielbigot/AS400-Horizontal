'use client'

interface Suggestion {
  id: string
  text: string
  prompt: string
}

interface AISuggestionsProps {
  onSuggestionClick: (prompt: string) => void
  disabled?: boolean
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    text: 'Résumé mensuel',
    prompt: 'Peux-tu me donner un résumé des transactions du mois en cours ?'
  },
  {
    id: '2',
    text: 'Vérifier soldes',
    prompt: 'Vérifie tous les soldes des comptes et signale les anomalies'
  },
  {
    id: '3',
    text: 'Factures impayées',
    prompt: 'Liste-moi toutes les factures impayées de plus de 30 jours'
  },
  {
    id: '4',
    text: 'Statistiques',
    prompt: 'Génère des statistiques financières pour le dernier trimestre'
  },
  {
    id: '5',
    text: 'Rapprochement',
    prompt: 'Aide-moi à faire le rapprochement bancaire du mois dernier'
  },
  {
    id: '6',
    text: 'Budget vs Réel',
    prompt: 'Compare le budget prévisionnel avec les dépenses réelles'
  }
]

export function AISuggestions({ onSuggestionClick, disabled = false }: AISuggestionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => onSuggestionClick(suggestion.prompt)}
          disabled={disabled}
          title={suggestion.prompt}
          className="
            px-4 py-3
            bg-background
            border border-border
            text-foreground
            rounded-lg
            text-sm
            font-medium
            hover:bg-accent
            hover:text-accent-foreground
            hover:border-muted-foreground/50
            transition-all
            duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:bg-background
            disabled:hover:text-foreground
            disabled:hover:border-border
            text-left
            flex items-center justify-center
            min-h-[60px]
          "
        >
          {suggestion.text}
        </button>
      ))}
    </div>
  )
}

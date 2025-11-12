"use client"

import { useEffect, useState } from "react"
import { AIAssistant } from "@/components/ai-assistant/ai-assistant"

interface AssistantSectionProps {
  isActive: boolean
}

export function AssistantSection({ isActive }: AssistantSectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isActive) {
      setMounted(true)
    }
  }, [isActive])

  return (
    <div className={`min-h-screen p-8 lg:p-16 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <header className="space-y-4 mb-8 flex-shrink-0">
          <div className="text-sm text-muted-foreground font-mono tracking-wider">
            COMPTABILITÉ / ASSISTANT IA
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-light tracking-tight">
              Assistant <span className="text-muted-foreground">Comptable</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Posez vos questions en langage naturel
            </p>
          </div>
        </header>

        {/* AI Assistant Component */}
        <div className="flex-1 min-h-0">
          <AIAssistant />
        </div>
      </div>
    </div>
  )
}

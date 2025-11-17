"use client"

import { useEffect, useRef, useState } from "react"
import { DashboardSection } from "@/components/sections/DashboardSection"
import { PlanComptableSection } from "@/components/sections/PlanComptableSection"
import { JournauxSection } from "@/components/sections/JournauxSection"
import { EcrituresSection } from "@/components/sections/EcrituresSection"
import { BrouillardSection } from "@/components/sections/BrouillardSection"
import { LettrageSection } from "@/components/sections/LettrageSection"
import { RapportsSection } from "@/components/sections/RapportsSection"
import { ParametresSection } from "@/components/sections/ParametresSection"
import { AssistantSection } from "@/components/sections/AssistantSection"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CommandPalette } from "@/components/ui/command-palette"
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts"

export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const isScrollingRef = useRef(false)

  const sections = [
    { id: "dashboard", label: "Tableau de bord", component: DashboardSection },
    { id: "comptes", label: "Plan Comptable", component: PlanComptableSection },
    { id: "journaux", label: "Journaux", component: JournauxSection },
    { id: "ecritures", label: "Écritures", component: EcrituresSection },
    { id: "brouillard", label: "Brouillard", component: BrouillardSection },
    { id: "lettrage", label: "Lettrage", component: LettrageSection },
    { id: "rapports", label: "Rapports", component: RapportsSection },
    { id: "parametres", label: "Paramètres", component: ParametresSection },
    { id: "assistant", label: "Assistant IA", component: AssistantSection },
  ]

  // Gestion du scroll vertical → navigation horizontale
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let scrollAccumulator = 0
    let lastScrollTime = Date.now()

    const handleScroll = (e: WheelEvent) => {
      const currentTime = Date.now()
      const timeSinceLastScroll = currentTime - lastScrollTime
      lastScrollTime = currentTime

      // Si on est en train de naviguer, bloquer
      if (isScrollingRef.current) {
        e.preventDefault()
        return
      }

      // Vérifier la section active
      const section = sectionsRef.current[activeSection]

      if (section) {
        const isAtTop = section.scrollTop <= 1
        const isAtBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 1

        // Si on scrolle vers le haut et qu'on est en haut de la section
        if (e.deltaY < 0 && isAtTop && activeSection > 0) {
          e.preventDefault()
          scrollAccumulator += e.deltaY

          if (scrollAccumulator <= -100) {
            isScrollingRef.current = true
            setActiveSection((prev) => prev - 1)
            scrollAccumulator = 0

            setTimeout(() => {
              isScrollingRef.current = false
            }, 1000)
          }
        }
        // Si on scrolle vers le bas et qu'on est en bas de la section
        else if (e.deltaY > 0 && isAtBottom && activeSection < sections.length - 1) {
          e.preventDefault()
          scrollAccumulator += e.deltaY

          if (scrollAccumulator >= 100) {
            isScrollingRef.current = true
            setActiveSection((prev) => prev + 1)
            scrollAccumulator = 0

            setTimeout(() => {
              isScrollingRef.current = false
            }, 1000)
          }
        }
        // Sinon, laisser le scroll normal et réinitialiser
        else {
          scrollAccumulator = 0
        }
      }

      // Réinitialiser l'accumulateur après inactivité
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        scrollAccumulator = 0
      }, 200)
    }

    // Ajouter l'écouteur sur window
    window.addEventListener("wheel", handleScroll, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [activeSection, sections.length])

  // Scroll automatique vers la section active - Désactivé car on utilise transform
  // useEffect(() => {
  //   const section = sectionsRef.current[activeSection]
  //   if (section) {
  //     section.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })
  //   }
  // }, [activeSection])

  const navigateToSection = (index: number) => {
    setActiveSection(index)
  }

  // Navigation avec les flèches du clavier
  useNavigationShortcuts(
    () => {
      if (activeSection < sections.length - 1) {
        setActiveSection((prev) => prev + 1)
      }
    },
    () => {
      if (activeSection > 0) {
        setActiveSection((prev) => prev - 1)
      }
    }
  )

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        sections={sections.map((s) => s.label)}
        onNavigateToSection={navigateToSection}
      />

      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Navigation latérale */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => navigateToSection(index)}
              className={`group relative w-2 h-12 rounded-full transition-all duration-500 ${
                activeSection === index
                  ? "bg-foreground"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section.label}`}
            >
              <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-muted-foreground bg-background/90 px-3 py-1 rounded-md border border-border">
                {section.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Indicateur de section (mobile) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <div className="glass px-4 py-2 rounded-full">
          <span className="text-xs font-mono text-muted-foreground">
            {sections[activeSection].label}
          </span>
        </div>
      </div>

      {/* Container horizontal avec sections */}
      <div
        ref={containerRef}
        className="flex h-screen transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${activeSection * 100}vw)`,
        }}
      >
        {sections.map((section, index) => {
          const SectionComponent = section.component
          return (
            <section
              key={section.id}
              ref={(el) => {
                sectionsRef.current[index] = el
              }}
              className="flex-none w-screen h-screen overflow-y-auto"
              id={section.id}
            >
              <SectionComponent isActive={activeSection === index} />
            </section>
          )
        })}
      </div>

      {/* Navigation fléchée (mobile) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 lg:hidden">
        <button
          onClick={() => activeSection > 0 && navigateToSection(activeSection - 1)}
          disabled={activeSection === 0}
          className="glass p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() =>
            activeSection < sections.length - 1 &&
            navigateToSection(activeSection + 1)
          }
          disabled={activeSection === sections.length - 1}
          className="glass p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-40" />
    </div>
  )
}

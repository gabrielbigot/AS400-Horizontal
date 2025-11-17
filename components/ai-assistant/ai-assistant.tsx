'use client'

import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AIChat, Message } from './ai-chat'
import AIPrompt from './ai-prompt'
import { BarVisualizer, type AgentState as BarVisualizerState } from '../ui/bar-visualizer'
import { AgentState } from '../ui/orb'
import { sendChatMessage } from '@/lib/api'
import { useChatOverlay } from '@/hooks/use-chat-overlay'
import { AnimatePresence, motion } from 'motion/react'

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [agentState, setAgentState] = useState<AgentState>(null)
  const { isVisible, setIsVisible } = useChatOverlay()

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Set loading state
    setIsLoading(true)
    setAgentState('listening')

    try {
      // Send to backend
      const response = await sendChatMessage(content)

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setAgentState('talking')

      // Reset agent state after 2 seconds
      setTimeout(() => {
        setAgentState(null)
      }, 2000)
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: `Erreur de connexion au serveur AI. Veuillez vérifier que le serveur backend est en cours d'exécution sur localhost:5000.\n\nDétails: ${
          error instanceof Error ? error.message : 'Erreur inconnue'
        }`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setAgentState(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleClearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const handleExportMessages = useCallback(() => {
    const exportData = {
      date: new Date().toISOString(),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [messages])

  // Overlay à rendre via portal
  const overlayContent = isVisible && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
        onClick={() => setIsVisible(false)}
      />

      {/* Chat Input */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] w-[90%] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Hint text */}
          <div className="absolute -top-8 right-2 text-xs text-muted-foreground/70">
            Appuyez sur <kbd className="px-1.5 py-0.5 text-xs bg-background/50 rounded">Esc</kbd> pour fermer
          </div>

          <AIPrompt
            onSendMessage={(msg) => {
              handleSendMessage(msg);
              setIsVisible(false);
            }}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </>
  )

  return (
    <>
      <div className="space-y-12 relative">
        {/* Header avec indication */}
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-4">
            {agentState && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-muted-foreground">
                  {agentState === 'listening' && 'Écoute...'}
                  {agentState === 'talking' && 'Répond...'}
                  {agentState === 'thinking' && 'Réfléchit...'}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Appuyez sur <kbd className="px-2 py-1 text-xs bg-muted rounded">Espace</kbd> pour ouvrir le chat
          </p>
        </div>

        {/* Chat messages - naturally flowing */}
      <AIChat
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearMessages={handleClearMessages}
        onExportMessages={handleExportMessages}
        isLoading={isLoading}
        agentState={agentState}
        showInput={false}
      />
      </div>

      {/* Chat Input Overlay - Rendered via Portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {overlayContent}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

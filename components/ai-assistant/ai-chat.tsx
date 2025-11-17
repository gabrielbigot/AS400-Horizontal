'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AgentState } from '../ui/orb'
import { Message as MessageUI, MessageContent } from '../ui/message'
import { Response } from '../ui/response'
import { C1Component, ThemeProvider } from '@thesysai/genui-sdk'
import '@crayonai/react-ui/styles/index.css'

// Import Orb dynamically to avoid SSR issues with react-three-fiber
const Orb = dynamic(() => import('../ui/orb').then(mod => ({ default: mod.Orb })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted rounded-full" />
})

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'error'
  content: string
  timestamp: Date
}

interface AIChatProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  onClearMessages: () => void
  onExportMessages: () => void
  isLoading?: boolean
  agentState?: AgentState
  showInput?: boolean
}

export function AIChat({
  messages,
  onSendMessage,
  onClearMessages,
  onExportMessages,
  isLoading = false,
  agentState = null,
  showInput = true
}: AIChatProps) {
  const [input, setInput] = useState('')

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const MessageBubble = ({ message }: { message: Message }) => {
    // Use theme colors for orbs
    const orbColors: [string, string] =
      message.role === 'assistant'
        ? ['hsl(var(--foreground))', 'hsl(var(--muted-foreground))']
        : message.role === 'user'
        ? ['hsl(var(--primary))', 'hsl(var(--primary) / 0.7)']
        : ['hsl(var(--destructive))', 'hsl(var(--destructive) / 0.7)']

    const [messageAgentState, setMessageAgentState] = useState<AgentState>(null)
    const [mounted, setMounted] = useState(false)

    // Handle mounting
    useEffect(() => {
      setMounted(true)
    }, [])

    // Set agent state for assistant messages
    useEffect(() => {
      if (message.role === 'assistant') {
        setMessageAgentState('talking')
        const timer = setTimeout(() => {
          setMessageAgentState(null)
        }, 2000)
        return () => clearTimeout(timer)
      }
    }, [message.role])

    // Generate stable seed from message ID
    const orbSeed = parseInt(message.id, 10) || 0

    // Determine message styling based on role
    const messageStyles = {
      assistant: 'glass border-border bg-card/50 text-foreground',
      user: 'glass border-primary/30 bg-primary/5 text-foreground',
      error: 'glass border-destructive/30 bg-destructive/5 text-destructive'
    }

    const timestampStyles = {
      assistant: 'text-muted-foreground',
      user: 'text-muted-foreground',
      error: 'text-destructive/70'
    }

    return (
      <MessageUI from={message.role === 'error' ? 'assistant' : message.role}>
        <MessageContent>
          {message.role === 'assistant' && mounted ? (
            <div className={`${messageStyles[message.role]} border rounded-lg p-4 inline-block`}>
              <ThemeProvider mode="dark">
                <C1Component
                  c1Response={message.content}
                  isStreaming={false}
                  onAction={({ llmFriendlyMessage }) => {
                    // Handle interactive actions from C1 components
                    // Send the action's prompt to the backend to trigger a new AI response
                    if (llmFriendlyMessage && !isLoading) {
                      onSendMessage(llmFriendlyMessage)
                    }
                  }}
                />
              </ThemeProvider>
            </div>
          ) : message.role === 'assistant' && !mounted ? (
            <Response
              className={`${messageStyles[message.role]} border rounded-lg`}
            >
              <div className="flex gap-2 items-center">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-100">●</span>
                <span className="animate-pulse delay-200">●</span>
              </div>
            </Response>
          ) : (
            <Response
              className={`${messageStyles[message.role]} border rounded-lg`}
            >
              {message.content}
            </Response>
          )}
          {mounted && (
            <div className={`text-xs ${timestampStyles[message.role]}`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          )}
        </MessageContent>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-background border border-border flex-shrink-0">
          <Orb
            colors={orbColors}
            agentState={message.role === 'assistant' ? agentState : null}
            seed={orbSeed}
            size={40}
            className="w-full h-full"
          />
        </div>
      </MessageUI>
    )
  }

  return (
    <div className="space-y-8">
      {/* Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <MessageUI from="assistant">
            <MessageContent>
              <Response className="glass border-border bg-card/50 text-foreground border rounded-lg">
                <div className="flex gap-2 items-center">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-100">●</span>
                  <span className="animate-pulse delay-200">●</span>
                </div>
              </Response>
            </MessageContent>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-background border border-border">
              <Orb
                colors={['hsl(var(--foreground))', 'hsl(var(--muted-foreground))']}
                agentState="listening"
                seed={999999}
                size={40}
                className="w-full h-full"
              />
            </div>
          </MessageUI>
        )}
      </div>

      {/* Input area - shown only if showInput is true */}
      {showInput && (
        <div className="glass rounded-lg p-6 border border-border sticky bottom-8 bg-background/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Tapez votre message... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
              className="
                w-full px-4 py-3
                bg-background
                border border-input
                text-foreground
                placeholder:text-muted-foreground
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-ring
                focus:border-ring
                resize-none
                min-h-[60px]
                max-h-[120px]
                transition-all
              "
              disabled={isLoading}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="
                  flex-1 px-4 py-2
                  bg-primary
                  text-primary-foreground
                  font-medium
                  rounded-lg
                  hover:bg-primary/90
                  transition-colors
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Envoyer
              </button>
              <button
                type="button"
                onClick={onExportMessages}
                disabled={messages.length === 0}
                className="
                  px-4 py-2
                  bg-background
                  border border-border
                  text-foreground
                  rounded-lg
                  hover:bg-accent
                  hover:text-accent-foreground
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Exporter
              </button>
              <button
                type="button"
                onClick={onClearMessages}
                disabled={messages.length === 0}
                className="
                  px-4 py-2
                  bg-background
                  border border-destructive/30
                  text-destructive
                  rounded-lg
                  hover:bg-destructive/10
                  hover:border-destructive/50
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Effacer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

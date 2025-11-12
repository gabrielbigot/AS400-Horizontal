'use client'

import { useEffect, useRef, useState } from 'react'

interface WaveformProps {
  isActive?: boolean
  color?: string
  bars?: number
}

// Helper function to get computed CSS variable value
function getCSSVariableValue(variable: string): string {
  if (typeof window === 'undefined') return '#000000'
  
  // If it's already a valid color (not a CSS variable), return it
  if (!variable.includes('var(')) {
    return variable
  }
  
  // Extract variable name from hsl(var(--foreground)) format
  const match = variable.match(/var\(--([^)]+)\)/)
  if (!match) return '#000000'
  
  const varName = match[1]
  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName}`)
    .trim()
  
  // Convert HSL format (e.g., "0 0% 98%") to full HSL string
  if (computed && computed.includes(' ')) {
    return `hsl(${computed})`
  }
  
  // If it's already a valid color format, return it
  if (computed && (computed.startsWith('#') || computed.startsWith('rgb') || computed.startsWith('hsl'))) {
    return computed
  }
  
  return computed || '#000000'
}

export function AIWaveform({
  isActive = false,
  color = 'hsl(var(--foreground))',
  bars = 40
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const heightsRef = useRef<number[]>(Array(bars).fill(0))
  const [computedColor, setComputedColor] = useState<string>('#000000')

  // Compute the actual color value from CSS variable
  useEffect(() => {
    const actualColor = getCSSVariableValue(color)
    setComputedColor(actualColor)
  }, [color])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const width = canvas.width
      const height = canvas.height
      const barWidth = width / bars
      const gap = 2

      ctx.clearRect(0, 0, width, height)

      // Update heights with random values if active
      if (isActive) {
        heightsRef.current = heightsRef.current.map((prev, i) => {
          const target = Math.random() * height * 0.8
          return prev + (target - prev) * 0.2
        })
      } else {
        heightsRef.current = heightsRef.current.map(h => h * 0.9) // Fade out
      }

      // Draw bars
      heightsRef.current.forEach((barHeight, i) => {
        const x = i * barWidth
        const y = (height - barHeight) / 2

        ctx.fillStyle = computedColor
        ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, computedColor, bars])

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  )
}

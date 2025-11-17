"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ShimmeringText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("animate-pulse", className)}
    {...props}
  >
    {children}
  </span>
))
ShimmeringText.displayName = "ShimmeringText"

export { ShimmeringText }

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Response = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-3 rounded-lg whitespace-pre-wrap break-words inline-block",
      className
    )}
    {...props}
  />
))
Response.displayName = "Response"

export { Response }

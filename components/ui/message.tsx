"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  from: "user" | "assistant"
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, from, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 items-start",
          from === "user" && "flex-row-reverse",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Message.displayName = "Message"

const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 max-w-[80%]", className)}
    {...props}
  />
))
MessageContent.displayName = "MessageContent"

export { Message, MessageContent }

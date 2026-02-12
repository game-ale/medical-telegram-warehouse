"use client"

import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  indicatorColor,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorColor?: string }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all", indicatorColor || "bg-primary")}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }


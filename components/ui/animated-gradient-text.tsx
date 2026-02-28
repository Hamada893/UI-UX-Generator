import { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedGradientTextProps extends ComponentPropsWithoutRef<"div"> {
  speed?: number
  colorFrom?: string
  colorTo?: string
}

/**
 * Render an inline span that displays animated gradient text with configurable colors and speed.
 *
 * @param speed - Multiplier for the gradient animation speed; higher values increase the animation length (defaults to 1)
 * @param colorFrom - The primary gradient color used for the start and end stops (defaults to "#ffaa40")
 * @param colorTo - The secondary gradient color used for the middle stop (defaults to "#9c40ff")
 * @param className - Additional CSS class names to apply to the span
 * @returns A span element whose text is filled with an animated gradient driven by CSS custom properties
 */
export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      style={
        {
          "--bg-size": `${speed * 300}%`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        `animate-gradient inline bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

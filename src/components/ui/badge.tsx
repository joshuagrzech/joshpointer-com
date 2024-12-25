import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useConfig } from "@/contexts/ConfigContext"
import type { Config } from "@/contexts/ConfigContext"

const createBadgeVariants = (config: Config | null) => cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: config?.ui?.badges?.variants || {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<ReturnType<typeof createBadgeVariants>> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const { config } = useConfig();
  const badgeVariants = createBadgeVariants(config);
  
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, createBadgeVariants as badgeVariants }

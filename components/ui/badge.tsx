import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-matin-primary text-white hover:bg-matin-primary/80",
                secondary: "border-transparent bg-matin-secondary text-matin-primary hover:bg-matin-secondary/80",
                destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
                outline: "text-foreground",
                success: "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
                warning: "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                danger: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
                available: "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
                rented: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
                maintenance: "border-transparent bg-orange-100 text-orange-700 hover:bg-orange-200",
            }
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
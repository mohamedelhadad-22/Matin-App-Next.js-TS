import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Base styles: height, rounded corners, border color
                    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none",
                    // File input styles (if type="file")
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    // Placeholder styles
                    "placeholder:text-gray-400",
                    // Focus state: Outline removal and branding ring color
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matin-primary/50 focus-visible:border-matin-primary",
                    // Disabled state
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
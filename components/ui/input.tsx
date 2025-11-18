import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-md border-2 border-zinc-700 bg-zinc-900/80 px-5 py-4 text-base text-white placeholder:text-zinc-500 backdrop-blur-sm transition-all duration-200 focus:border-[#4B9EF9] focus:bg-zinc-900 focus:ring-2 focus:ring-[#4B9EF9]/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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

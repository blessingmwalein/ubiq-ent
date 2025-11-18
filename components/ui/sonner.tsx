"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-white group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-300 group-[.toast]:hover:bg-zinc-700",
          error: "group-[.toaster]:bg-red-950 group-[.toaster]:border-red-800 group-[.toaster]:text-red-100",
          success: "group-[.toaster]:bg-green-950 group-[.toaster]:border-green-800 group-[.toaster]:text-green-100",
          warning: "group-[.toaster]:bg-yellow-950 group-[.toaster]:border-yellow-800 group-[.toaster]:text-yellow-100",
          info: "group-[.toaster]:bg-blue-950 group-[.toaster]:border-blue-800 group-[.toaster]:text-blue-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

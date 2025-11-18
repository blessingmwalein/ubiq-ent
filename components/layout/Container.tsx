import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'full'
}

const sizeClasses = {
  sm: 'max-w-4xl',
  default: 'max-w-7xl',
  lg: 'max-w-[1600px]',
  full: 'max-w-full',
}

export default function Container({
  children,
  className,
  size = 'default',
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}

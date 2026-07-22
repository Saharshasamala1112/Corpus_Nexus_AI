import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline'
  className?: string
}

const variantClasses = {
  default: 'bg-primary/10 text-primary border-transparent',
  secondary: 'bg-muted text-muted-foreground border-transparent',
  outline: 'border-border text-muted-foreground',
}

function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge

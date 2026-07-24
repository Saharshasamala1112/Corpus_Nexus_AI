import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, icon, ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      {icon && (
        <div className="pointer-events-none absolute left-3 text-muted-foreground">{icon}</div>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          icon && 'pl-9',
          className
        )}
        {...props}
      />
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
export default Input

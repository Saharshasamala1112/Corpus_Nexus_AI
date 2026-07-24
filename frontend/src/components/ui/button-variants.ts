import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
        secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
        outline: 'border border-white/10 bg-transparent text-slate-200 hover:bg-white/5',
        ghost: 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
      },
      size: {
        default: 'h-9 px-3 py-2 sm:px-4',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-lg px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

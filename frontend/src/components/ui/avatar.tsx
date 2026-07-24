import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt?: string
  fallback: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-11 text-base',
}

function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || fallback}
        className={cn('shrink-0 rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
        sizeClasses[size],
        className
      )}
      title={alt || fallback}
    >
      {fallback}
    </div>
  )
}

export default Avatar

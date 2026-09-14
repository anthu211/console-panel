import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'secondary' | 'tertiary' | 'neutral' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  outline: 'border border-shell-border bg-transparent text-shell-text-2 hover:border-shell-muted hover:bg-shell-hover',
  secondary: 'bg-accent/10 text-accent hover:bg-accent/15',
  tertiary: 'bg-transparent text-shell-text-2 hover:bg-shell-hover',
  neutral: 'bg-shell-raised text-shell-muted border border-shell-border hover:bg-shell-elevated hover:text-shell-text',
  danger: 'bg-[#feebec] text-[#d12329] hover:bg-[#ffdbdc]',
}

const sizes: Record<Size, string> = {
  sm: 'h-6 px-3 text-[12px]',
  md: 'h-8 px-4 text-[14px]',
  lg: 'h-10 px-5 text-[14px]',
  icon: 'h-7 w-7 rounded-full p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-pill font-medium leading-none transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-40',
        size !== 'icon' && variants[variant],
        size === 'icon' && 'bg-transparent text-shell-muted hover:bg-shell-hover hover:text-shell-text',
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'

import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary:
    'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:bg-gray-800 disabled:text-gray-600 text-black',
  danger:
    'border border-red-900/60 hover:border-red-700 text-red-700 hover:text-red-500',
  ghost:
    'text-gray-600 hover:text-gray-400 border border-gray-800 hover:border-gray-600',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-bold py-2 px-4 rounded-lg text-xs tracking-widest transition-colors
                  uppercase disabled:cursor-not-allowed
                  ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

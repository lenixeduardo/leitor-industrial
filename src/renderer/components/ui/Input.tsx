import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2 text-white text-sm
                    font-mono placeholder-gray-700 focus:outline-none transition-colors
                    ${error
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-gray-700 focus:border-amber-500'
                    } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1.5">{error}</p>
      )}
    </div>
  )
}

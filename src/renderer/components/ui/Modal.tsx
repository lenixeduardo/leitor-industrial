import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  children: ReactNode
  onClose?: () => void
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 w-96">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

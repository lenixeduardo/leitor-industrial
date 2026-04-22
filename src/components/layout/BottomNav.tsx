'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScanLine, History, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/scan', label: 'Scan', icon: ScanLine },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/equipamentos', label: 'Ativos', icon: Package },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

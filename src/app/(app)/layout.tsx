import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import BottomNav from '@/components/layout/BottomNav'
import OfflineBanner from '@/components/OfflineBanner'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OfflineBanner />
      <main className="flex-1 pb-16 pt-0">{children}</main>
      <BottomNav />
    </div>
  )
}

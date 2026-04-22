import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

let client: ReturnType<typeof createBrowserClient> | undefined

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient(env.supabaseUrl, env.supabaseAnonKey)
  }
  return client
}

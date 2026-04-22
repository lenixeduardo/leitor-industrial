function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Copy .env.local.example to .env.local and fill in the values.`
    )
  }
  return value
}

// Lazy getters — validation runs at first access (request time), not at build time.
export const env = {
  get supabaseUrl()     { return requireEnv('NEXT_PUBLIC_SUPABASE_URL') },
  get supabaseAnonKey() { return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') },
}

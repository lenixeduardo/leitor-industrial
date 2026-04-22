import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  // Serwist uses a webpack plugin incompatible with Turbopack; disable outside production
  disable: process.env.NODE_ENV !== 'production',
})

// Non-CSP headers applied globally via Next.js config.
// CSP itself is set per-request in src/proxy.ts using a nonce (no unsafe-inline/unsafe-eval).
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',            value: 'on' },
  { key: 'Strict-Transport-Security',         value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options',                   value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',            value: 'nosniff' },
  { key: 'Referrer-Policy',                   value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',                value: 'camera=(self), geolocation=(self), microphone=()' },
]

const nextConfig: NextConfig = {
  // empty turbopack config silences the webpack-with-no-turbopack-config error
  turbopack: {},

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withSerwist(nextConfig)

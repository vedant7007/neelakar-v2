// Single source of truth for the site's public URL.
// Override per-environment with NEXT_PUBLIC_SITE_URL (e.g. a staging domain);
// defaults to the production domain the site is delivered on.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://neelakar.com').replace(/\/+$/, '')

// Origin used to fetch static assets baked into server-rendered OG/Twitter cards.
// Kept independent of the custom domain so social previews keep working even
// while neelakar.com DNS is still propagating. Vercel injects
// VERCEL_PROJECT_PRODUCTION_URL (the always-live *.vercel.app host) at runtime.
export const ASSET_ORIGIN = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://neelakar-v2.vercel.app'

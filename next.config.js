const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  },
  // Static OG routes read these at build time, but /u/[id] renders on demand and
  // file tracing doesn't follow readFileSync(process.cwd()) into the bundle.
  outputFileTracingIncludes: {
    '/u/[id]/opengraph-image': ['./public/logo_with_no_text_transparent*.png'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)

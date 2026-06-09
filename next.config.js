const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  },
  serverExternalPackages: ['@pyroscope/nodejs', '@datadog/pprof'],
}

module.exports = withBundleAnalyzer(nextConfig)

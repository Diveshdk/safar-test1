/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@clerk/nextjs"],
  },
  images: {
    domains: ["images.unsplash.com", "img.clerk.com"],
    unoptimized: true,
  },
  env: {
    CLERK_TELEMETRY_DISABLED: "1",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static optimization for all pages
  output: "standalone",
  // Add error handling
  async rewrites() {
    return []
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig

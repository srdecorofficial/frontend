/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebaseapp.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-d86c9f986cbe425abc6e9114a5307135.r2.dev',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle undici module parsing issues
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    })

    // Exclude undici from processing
    config.externals = config.externals || []
    if (isServer) {
      config.externals.push('undici')
    }

    return config
  },
  transpilePackages: ['undici'],
}

module.exports = nextConfig

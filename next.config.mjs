/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
    const backendApiUrl = configuredApiUrl && !configuredApiUrl.includes(',')
      ? configuredApiUrl.replace(/\/$/, '')
      : 'https://api.rupakar.com/api/v1'

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendApiUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig

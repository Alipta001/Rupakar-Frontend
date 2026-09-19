/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://rupakar-backend.onrender.com/api/v1').replace(/\/$/, '')

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendApiUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  i18n: {
    locales: ["en", "kn"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nandubus-images.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "nandubus-prod-images.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "amenities-nandubus-prod-images.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "amenities-nandubus-images.s3.ap-south-1.amazonaws.com",
      },
    ],
    domains: ['images.unsplash.com', 'images.pexels.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

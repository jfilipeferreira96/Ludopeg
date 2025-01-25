/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? "development",
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.wired.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

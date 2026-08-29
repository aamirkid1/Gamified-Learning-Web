/** @type {import('next').NextConfig} */

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = new URL(apiUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: api.protocol.replace(":", ""),
        hostname: api.hostname,
        port: api.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
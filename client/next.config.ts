import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:version/:path*",
        destination: `${process.env.BATI_BACKEND_URL}/api/:version/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    BATI_BACKEND_URL: process.env.BATI_BACKEND_URL,
    BATI_DIRECT_TRUST_CLIENT_ID: process.env.BATI_DIRECT_TRUST_CLIENT_ID,
    BATI_DIRECT_TRUST_SECRET_VALUE: process.env.BATI_DIRECT_TRUST_SECRET_VALUE,
    BATI_DIRECT_TRUST_SECRET_ID: process.env.BATI_DIRECT_TRUST_SECRET_ID,
    BATI_DIRECT_TRUST_SUB_USER: process.env.BATI_DIRECT_TRUST_SUB_USER,
  },
};

export default nextConfig;

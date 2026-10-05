import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.VERCEL_ENV === 'production' ? 'true' : 'false',
  },
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

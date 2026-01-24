import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "172.20.224.1:3000", "[IP_ADDRESS]"],
    },
  },
};

export default nextConfig;

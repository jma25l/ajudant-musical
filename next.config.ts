import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useTypeScriptCli: true,
  },
  output: process.env.MODE == "RELEASE"?'standalone':undefined
};

export default nextConfig;

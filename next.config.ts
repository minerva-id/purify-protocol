import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {},
  /* config options here */
  webpack: (config, { isServer }) => {
    // Ensure the app resolves a single copy of these libs to avoid runtime type mismatches
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@solana/web3.js': path.resolve(__dirname, 'node_modules/@solana/web3.js'),
      '@coral-xyz/anchor': path.resolve(__dirname, 'node_modules/@coral-xyz/anchor'),
    };
    return config;
  }
};

export default nextConfig;

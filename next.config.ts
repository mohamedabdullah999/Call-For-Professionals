import type { NextConfig } from 'next';
import { basePath } from './src/lib/base-path';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  // Served under a sub-path behind nginx (see deploy/nginx-speakerreg.conf). '' = served from the root.
  basePath,
  // Same value for client code, even when NEXT_PUBLIC_BASE_PATH was not set at build time
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  // Branded 404 for URLs outside /en and /ar (the root layout lives under [locale])
  experimental: { globalNotFound: true },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;

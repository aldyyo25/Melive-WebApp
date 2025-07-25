import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure headers for better security and media access
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // Allow camera and microphone for localhost
          {
            key: 'Permissions-Policy',
            value: 'camera=(self "https://localhost:*"), microphone=(self "https://localhost:*")'
          }
        ],
      },
    ];
  },

  // Webpack configuration (only used when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Only apply webpack fallbacks when not using Turbopack
    if (!isServer && !process.env.TURBOPACK) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;

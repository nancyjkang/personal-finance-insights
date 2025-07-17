/** @type {import('next').NextConfig} */

// Determine if we're building for static export (Hostinger shared hosting)
const isStaticExport = process.env.BUILD_STANDALONE === 'true';

const nextConfig = {
  // Conditional configuration based on hosting type
  ...(isStaticExport && {
    output: 'export',
    distDir: 'out',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    images: {
      unoptimized: true, // Required for static export
    },
  }),

  // External packages for server components  
  serverExternalPackages: ['next-auth'],

  // Production optimizations (disable CSS optimization for compatibility)
  // experimental: {
  //   optimizeCss: true,
  // },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    ...(!isStaticExport && {
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    }),
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for security and performance (not available in static export)
  ...(!isStaticExport && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
            },
          ],
        },
        {
          source: '/api/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: process.env.CORS_ORIGIN || process.env.NEXTAUTH_URL || '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
          ],
        },
      ];
    },

    // Redirects for common URLs (not available in static export)
    async redirects() {
      return [
        {
          source: '/login',
          destination: '/api/auth/signin',
          permanent: false,
        },
        {
          source: '/logout',
          destination: '/api/auth/signout',
          permanent: false,
        },
      ];
    },
  }),

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Environment variables to expose to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    DOMAIN_NAME: process.env.DOMAIN_NAME,
  },
};

module.exports = nextConfig;
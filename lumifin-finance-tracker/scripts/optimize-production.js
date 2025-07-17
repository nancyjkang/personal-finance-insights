#!/usr/bin/env node

/**
 * Production Optimization Script for Lumifin Finance Tracker
 * 
 * This script optimizes the application for production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Production Optimization for Lumifin Finance Tracker\n');

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  const prefix = {
    info: 'ℹ️ ',
    success: '✅ ',
    warning: '⚠️ ',
    error: '❌ '
  };
  
  console.log(`${colors[type]}${prefix[type]}${message}${colors.reset}`);
}

function optimizePackageJson() {
  log('Optimizing package.json for production...', 'info');
  
  const packagePath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add production-specific configurations
  packageJson.engines = {
    node: '>=18.0.0',
    npm: '>=8.0.0'
  };
  
  // Optimize scripts for production
  if (!packageJson.scripts['start:prod']) {
    packageJson.scripts['start:prod'] = 'NODE_ENV=production npm start';
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  log('package.json optimized', 'success');
}

function createPerformanceScript() {
  log('Creating performance monitoring script...', 'info');
  
  const perfScript = `#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Run this script to check production performance
 */

const https = require('https');
const { URL } = require('url');

function checkPagePerformance(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const request = https.get(url, (response) => {
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          url,
          statusCode: response.statusCode,
          loadTime,
          contentLength: data.length,
          headers: response.headers
        });
      });
    });
    
    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runPerformanceTest(baseUrl) {
  console.log('🚀 Running performance tests...\\n');
  
  const pages = [
    '/',
    '/auth/test',
    '/dashboard'
  ];
  
  for (const page of pages) {
    try {
      const fullUrl = new URL(page, baseUrl).toString();
      const result = await checkPagePerformance(fullUrl);
      
      console.log(\`📄 \${page}:\`);
      console.log(\`   Status: \${result.statusCode}\`);
      console.log(\`   Load time: \${result.loadTime}ms\`);
      console.log(\`   Content size: \${(result.contentLength / 1024).toFixed(2)}KB\`);
      console.log(\`   Cache headers: \${result.headers['cache-control'] || 'None'}\`);
      console.log('');
      
      if (result.loadTime > 3000) {
        console.log(\`   ⚠️  Slow load time detected!\`);
      }
      
    } catch (error) {
      console.log(\`❌ \${page}: \${error.message}\`);
    }
  }
}

// Usage
const url = process.argv[2];
if (!url) {
  console.log('Usage: node performance-check.js <https://yourdomain.com>');
  process.exit(1);
}

runPerformanceTest(url)
  .then(() => console.log('✅ Performance test completed'))
  .catch(error => console.error('❌ Performance test failed:', error));
`;
  
  fs.writeFileSync('scripts/performance-check.js', perfScript);
  log('Performance monitoring script created', 'success');
}

function generateSecurityConfig() {
  log('Generating security configuration...', 'info');
  
  const securityConfig = `# Security Configuration for Production

## Environment Variables Security
- Never commit .env.production to version control
- Use strong, unique secrets for NEXTAUTH_SECRET
- Rotate secrets regularly (every 6 months minimum)

## HTTPS Configuration
- Force HTTPS for all requests
- Use HSTS headers for enhanced security
- Ensure mixed content warnings are resolved

## Content Security Policy (CSP)
Consider adding CSP headers for enhanced security:

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' accounts.google.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.googleusercontent.com; connect-src 'self' accounts.google.com *.googleapis.com;
\`\`\`

## Rate Limiting
- Implement rate limiting for API endpoints
- Consider using Cloudflare or similar services for DDoS protection

## Security Headers Checklist
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] X-XSS-Protection: 1; mode=block
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: camera=(), microphone=(), geolocation=()
- [ ] Content-Security-Policy (implement as needed)
- [ ] Strict-Transport-Security (HSTS)

## Regular Security Tasks
1. Update dependencies monthly
2. Monitor security advisories
3. Review access logs quarterly
4. Audit OAuth permissions annually
`;
  
  fs.writeFileSync('SECURITY_CONFIG.md', securityConfig);
  log('Security configuration guide created', 'success');
}

function createBuildScript() {
  log('Creating optimized build script...', 'info');
  
  const buildScript = `#!/bin/bash

# Lumifin Finance Tracker - Optimized Production Build Script

echo "🚀 Starting optimized production build..."

# Set production environment
export NODE_ENV=production

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out dist

# Install dependencies (production only in CI/CD)
if [ "$CI" = "true" ]; then
  echo "📦 Installing production dependencies..."
  npm ci --only=production
fi

# Type check
echo "🔍 Running TypeScript type check..."
npm run type-check

# Lint check
echo "🧹 Running ESLint..."
npm run lint

# Build application
echo "🏗️  Building application..."
npm run build

# Generate static export if needed
if [ "$BUILD_STANDALONE" = "true" ]; then
  echo "📦 Generating static export..."
  npm run export
fi

# Create deployment package
echo "📦 Creating deployment package..."
npm run deploy:prepare

echo "✅ Production build completed successfully!"
`;
  
  fs.writeFileSync('scripts/build-production.sh', buildScript);
  log('Optimized build script created', 'success');
}

function main() {
  console.log('Starting production optimization...\n');
  
  try {
    optimizePackageJson();
    createPerformanceScript();
    generateSecurityConfig();
    createBuildScript();
    
    log('\n🎉 Production optimization completed!', 'success');
    log('Files created:', 'info');
    log('  - scripts/performance-check.js (performance monitoring)', 'info');
    log('  - scripts/build-production.sh (optimized build script)', 'info');
    log('  - SECURITY_CONFIG.md (security guidelines)', 'info');
    
  } catch (error) {
    log('Production optimization failed', 'error');
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
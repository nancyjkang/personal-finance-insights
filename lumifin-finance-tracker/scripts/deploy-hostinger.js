#!/usr/bin/env node

/**
 * Hostinger Deployment Script for Lumifin Finance Tracker
 * 
 * This script helps prepare and optimize the application for Hostinger deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Lumifin Finance Tracker - Hostinger Deployment Preparation\n');

// Configuration
const config = {
  buildDir: 'out', // Static export directory
  distDir: 'dist', // Distribution directory
  deploymentType: process.env.DEPLOYMENT_TYPE || 'static', // 'static' or 'server'
};

// Utility functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m' // Reset
  };
  
  const prefix = {
    info: 'ℹ️ ',
    success: '✅ ',
    warning: '⚠️ ',
    error: '❌ '
  };
  
  console.log(`${colors[type]}${prefix[type]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, 'success');
  }
}

function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
  log(`Copied: ${source} → ${destination}`, 'success');
}

// Validation functions
function validateEnvironment() {
  log('Validating environment configuration...', 'info');
  
  const envFile = '.env.production';
  if (!checkFileExists(envFile)) {
    log(`Missing ${envFile} file. Please create it using .env.production.example as template.`, 'error');
    return false;
  }
  
  // Check required environment variables
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  const missingVars = requiredVars.filter(varName => {
    const hasVar = envContent.includes(`${varName}=`) && 
                   !envContent.includes(`${varName}=your-`) &&
                   !envContent.includes(`${varName}=REPLACE`);
    return !hasVar;
  });
  
  if (missingVars.length > 0) {
    log(`Missing environment variables: ${missingVars.join(', ')}`, 'error');
    return false;
  }
  
  log('Environment validation passed', 'success');
  return true;
}

function validateDependencies() {
  log('Validating dependencies...', 'info');
  
  try {
    execSync('npm list --production', { stdio: 'pipe' });
    log('Dependencies validation passed', 'success');
    return true;
  } catch (error) {
    log('Dependencies validation failed. Run "npm install" first.', 'error');
    return false;
  }
}

// Build functions
function buildApplication() {
  log('Building application for production...', 'info');
  
  try {
    // Set environment for build
    const buildEnv = {
      ...process.env,
      NODE_ENV: 'production',
      BUILD_STANDALONE: config.deploymentType === 'static' ? 'true' : 'false'
    };
    
    if (config.deploymentType === 'static') {
      log('Building for static export (shared hosting)...', 'info');
      execSync('npm run build', { 
        stdio: 'inherit',
        env: buildEnv
      });
    } else {
      log('Building for server-side rendering...', 'info');
      execSync('npm run build', { 
        stdio: 'inherit',
        env: buildEnv
      });
    }
    
    log('Build completed successfully', 'success');
    return true;
  } catch (error) {
    log('Build failed', 'error');
    console.error(error.message);
    return false;
  }
}

function optimizeBuild() {
  log('Optimizing build for deployment...', 'info');
  
  const buildPath = config.deploymentType === 'static' ? config.buildDir : '.next';
  
  if (!checkFileExists(buildPath)) {
    log(`Build directory ${buildPath} not found`, 'error');
    return false;
  }
  
  // Create distribution directory
  createDirectory(config.distDir);
  
  // Copy build files
  try {
    if (config.deploymentType === 'static') {
      execSync(`cp -r ${buildPath}/* ${config.distDir}/`, { stdio: 'pipe' });
    } else {
      // For server deployment, copy necessary files
      execSync(`cp -r .next ${config.distDir}/`, { stdio: 'pipe' });
      execSync(`cp -r public ${config.distDir}/`, { stdio: 'pipe' });
      execSync(`cp package.json ${config.distDir}/`, { stdio: 'pipe' });
      execSync(`cp next.config.js ${config.distDir}/`, { stdio: 'pipe' });
    }
    
    log('Build optimization completed', 'success');
    return true;
  } catch (error) {
    log('Build optimization failed', 'error');
    console.error(error.message);
    return false;
  }
}

function createHtaccess() {
  log('Creating .htaccess file...', 'info');
  
  const htaccessContent = `# Lumifin Finance Tracker - Hostinger Configuration

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js routing for static export
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

# Cache optimization
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/json "access plus 1 day"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Prevent access to sensitive files
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

<Files "*.config.js">
    Order allow,deny
    Deny from all
</Files>
`;
  
  const htaccessPath = path.join(config.distDir, '.htaccess');
  fs.writeFileSync(htaccessPath, htaccessContent);
  log('Created .htaccess file', 'success');
}

function createDeploymentPackage() {
  log('Creating deployment package...', 'info');
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const packageName = `lumifin-deployment-${timestamp}.zip`;
    
    execSync(`cd ${config.distDir} && zip -r ../${packageName} .`, { stdio: 'pipe' });
    
    log(`Deployment package created: ${packageName}`, 'success');
    return packageName;
  } catch (error) {
    log('Failed to create deployment package', 'error');
    console.error(error.message);
    return null;
  }
}

function generateDeploymentInstructions(packageName) {
  const instructions = `
📋 DEPLOYMENT INSTRUCTIONS FOR HOSTINGER

Your Lumifin Finance Tracker is ready for deployment!

📦 Deployment Package: ${packageName || config.distDir + '/ directory'}

🔧 STEPS TO DEPLOY:

1. 🔐 Configure Google Cloud Console:
   - Go to https://console.cloud.google.com/
   - Update OAuth redirect URIs with your production domain
   - Add: https://yourdomain.com/api/auth/callback/google

2. 🌐 Upload to Hostinger:
   ${packageName ? 
     `- Upload ${packageName} to your Hostinger File Manager
   - Extract the zip file in your public_html directory` :
     `- Upload all files from ${config.distDir}/ to your public_html directory`}
   - Ensure .htaccess file is included and properly uploaded

3. 🔒 Configure SSL:
   - Enable free SSL certificate in Hostinger control panel
   - Verify HTTPS redirect is working

4. ✅ Test Deployment:
   - Visit https://yourdomain.com
   - Test Google sign-in functionality
   - Verify protected routes work correctly

5. 📊 Monitor:
   - Check browser console for any errors
   - Test on mobile devices
   - Verify all authentication flows

🔗 HELPFUL LINKS:
- Full deployment guide: ./HOSTINGER_DEPLOYMENT.md
- Google Cloud Console: https://console.cloud.google.com/
- Hostinger Support: https://support.hostinger.com/

⚠️  IMPORTANT REMINDERS:
- Keep your .env.production file secure and never commit it to git
- Update DNS records if using a custom domain
- Test thoroughly before going live
- Keep backups of your current deployment

Good luck with your deployment! 🚀
`;
  
  console.log(instructions);
  
  // Save instructions to file
  fs.writeFileSync('DEPLOYMENT_INSTRUCTIONS.txt', instructions);
  log('Deployment instructions saved to DEPLOYMENT_INSTRUCTIONS.txt', 'success');
}

// Performance analysis
function analyzeBundle() {
  log('Analyzing bundle size...', 'info');
  
  try {
    if (config.deploymentType === 'static') {
      const statsCommand = `find ${config.distDir} -type f -name "*.js" -o -name "*.css" | xargs wc -c | tail -1`;
      const result = execSync(statsCommand, { encoding: 'utf8' });
      const totalSize = parseInt(result.trim().split(' ')[0]);
      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
      
      log(`Total bundle size: ${sizeInMB} MB`, 'info');
      
      if (totalSize > 5 * 1024 * 1024) { // 5MB
        log('Bundle size is large. Consider code splitting for better performance.', 'warning');
      }
    }
  } catch (error) {
    log('Bundle analysis failed', 'warning');
  }
}

// Main execution
async function main() {
  console.log('Starting deployment preparation...\n');
  
  // Step 1: Validation
  if (!validateEnvironment()) {
    process.exit(1);
  }
  
  if (!validateDependencies()) {
    process.exit(1);
  }
  
  // Step 2: Build
  if (!buildApplication()) {
    process.exit(1);
  }
  
  // Step 3: Optimize
  if (!optimizeBuild()) {
    process.exit(1);
  }
  
  // Step 4: Configure
  createHtaccess();
  
  // Step 5: Package
  const packageName = createDeploymentPackage();
  
  // Step 6: Analyze
  analyzeBundle();
  
  // Step 7: Instructions
  generateDeploymentInstructions(packageName);
  
  log('\n🎉 Deployment preparation completed successfully!', 'success');
  log('Check DEPLOYMENT_INSTRUCTIONS.txt for next steps.', 'info');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/deploy-hostinger.js [options]

Options:
  --type=static|server    Deployment type (default: static)
  --help, -h             Show this help message

Environment variables:
  DEPLOYMENT_TYPE        Set deployment type (static or server)

Examples:
  node scripts/deploy-hostinger.js
  node scripts/deploy-hostinger.js --type=server
  DEPLOYMENT_TYPE=server node scripts/deploy-hostinger.js
`);
  process.exit(0);
}

// Parse arguments
args.forEach(arg => {
  if (arg.startsWith('--type=')) {
    config.deploymentType = arg.split('=')[1];
  }
});

// Validate deployment type
if (!['static', 'server'].includes(config.deploymentType)) {
  log('Invalid deployment type. Use "static" or "server".', 'error');
  process.exit(1);
}

log(`Deployment type: ${config.deploymentType}`, 'info');

// Run main function
main().catch(error => {
  log('Deployment preparation failed', 'error');
  console.error(error);
  process.exit(1);
});
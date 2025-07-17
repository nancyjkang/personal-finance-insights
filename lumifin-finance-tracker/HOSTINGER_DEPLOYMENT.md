# Hostinger Deployment Guide for Lumifin Finance Tracker

This guide provides step-by-step instructions for deploying the Lumifin Finance Tracker to Hostinger hosting.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Google Cloud Console Configuration](#google-cloud-console-configuration)
- [Environment Configuration](#environment-configuration)
- [Build Optimization](#build-optimization)
- [Hostinger Setup](#hostinger-setup)
- [Deployment Process](#deployment-process)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Testing and Verification](#testing-and-verification)
- [Troubleshooting](#troubleshooting)
- [Maintenance and Updates](#maintenance-and-updates)

## Prerequisites

Before deploying, ensure you have:

- ✅ Hostinger hosting account (Premium or Business plan recommended)
- ✅ Domain name configured with Hostinger
- ✅ Google Cloud Console project with OAuth credentials
- ✅ Node.js 18+ installed locally
- ✅ Git access to your repository
- ✅ FTP client or access to Hostinger File Manager

## Google Cloud Console Configuration

### 1. Update OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 client ID
5. Add production redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   https://www.yourdomain.com/api/auth/callback/google
   ```
6. Save the changes

### 2. Update OAuth Consent Screen

1. Go to **OAuth consent screen**
2. Update the following fields:
   - **Authorized domains**: Add your production domain
   - **Application homepage**: `https://yourdomain.com`
   - **Privacy policy**: `https://yourdomain.com/privacy` (create this page)
   - **Terms of service**: `https://yourdomain.com/terms` (create this page)

## Environment Configuration

### 1. Create Production Environment File

1. Copy `.env.production.example` to `.env.production`:
   ```bash
   cp .env.production.example .env.production
   ```

2. Fill in your production values:
   ```env
   NEXTAUTH_SECRET=your-super-secure-nextauth-secret-here-min-32-chars
   NEXTAUTH_URL=https://yourdomain.com
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
   NODE_ENV=production
   DOMAIN_NAME=yourdomain.com
   CORS_ORIGIN=https://yourdomain.com
   ```

### 2. Generate NextAuth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Build Optimization

### 1. Configure Next.js for Static Export (Shared Hosting)

If using Hostinger shared hosting, configure for static export:

Create `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  }
}

module.exports = nextConfig
```

### 2. For VPS/Business Plans (Server-Side Rendering)

For advanced hosting plans, keep standard configuration:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js configuration
  experimental: {
    serverComponentsExternalPackages: ['next-auth']
  }
}

module.exports = nextConfig
```

### 3. Build the Application

Run the production build:
```bash
# Install dependencies
npm install

# Build for production
npm run build

# For static export (shared hosting)
npm run build && npm run export
```

## Hostinger Setup

### 1. Access cPanel

1. Log into your Hostinger account
2. Go to your hosting panel
3. Click on **File Manager** or use **FTP**

### 2. Prepare Directory Structure

Create the following structure in your `public_html` folder:
```
public_html/
├── _next/           (Next.js build files)
├── api/             (API routes if supported)
├── assets/          (Static assets)
├── index.html       (Main entry point)
└── .htaccess        (URL rewriting rules)
```

### 3. Create .htaccess File

Create `.htaccess` in `public_html`:
```apache
# Lumifin Finance Tracker - Hostinger Configuration

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/auth/(.*)$ /api/auth/$1 [L]

# Handle static files
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
</IfModule>
```

## Deployment Process

### Method 1: FTP Upload (Recommended)

1. **Build the application locally:**
   ```bash
   npm run build
   ```

2. **Upload files via FTP:**
   - Connect to your Hostinger FTP
   - Upload the `dist` folder contents (or `out` folder for static export) to `public_html`
   - Upload `.htaccess` file
   - Ensure file permissions are correct (644 for files, 755 for directories)

### Method 2: File Manager Upload

1. **Compress build files:**
   ```bash
   zip -r build.zip dist/
   ```

2. **Upload via File Manager:**
   - Access Hostinger File Manager
   - Navigate to `public_html`
   - Upload and extract `build.zip`
   - Upload `.htaccess` file

### Method 3: Git-based Deployment (Advanced)

1. **SSH into your server** (VPS plans only)
2. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/lumifin-finance-tracker.git
   cd lumifin-finance-tracker
   ```

3. **Install and build:**
   ```bash
   npm install
   npm run build
   ```

4. **Copy to web directory:**
   ```bash
   cp -r dist/* /public_html/
   ```

## SSL Certificate Setup

### 1. Enable SSL in Hostinger

1. Go to your Hostinger control panel
2. Navigate to **SSL** section
3. Enable **Free SSL Certificate** for your domain
4. Wait for certificate to be issued (usually 5-15 minutes)

### 2. Force HTTPS

The `.htaccess` file already includes HTTPS redirect rules. Verify it's working by visiting:
- `http://yourdomain.com` (should redirect to HTTPS)
- `https://yourdomain.com` (should load securely)

### 3. Update Google OAuth Settings

1. Return to Google Cloud Console
2. Update OAuth redirect URIs to use HTTPS only
3. Remove any HTTP URLs

## Testing and Verification

### 1. Basic Functionality Test

1. **Visit your domain:** `https://yourdomain.com`
2. **Test navigation:** Verify all pages load correctly
3. **Test authentication:** Try the Google sign-in flow
4. **Test protected routes:** Access `/dashboard` and `/auth/test`

### 2. Performance Test

1. **Run Lighthouse audit:** Check performance, accessibility, SEO
2. **Test mobile responsiveness:** Verify on different devices
3. **Check loading times:** Ensure pages load within 3 seconds

### 3. Security Test

1. **SSL Labs Test:** [SSL Labs](https://www.ssllabs.com/ssltest/)
2. **Security Headers:** [Security Headers](https://securityheaders.com/)
3. **HTTPS verification:** Ensure all resources load over HTTPS

## Troubleshooting

### Common Issues and Solutions

#### 1. 500 Internal Server Error
- **Cause:** Incorrect `.htaccess` configuration
- **Solution:** Check `.htaccess` syntax, ensure mod_rewrite is enabled

#### 2. Google OAuth Not Working
- **Cause:** Incorrect redirect URIs or environment variables
- **Solution:** 
  - Verify `NEXTAUTH_URL` matches your domain exactly
  - Check Google Console OAuth settings
  - Ensure HTTPS is working

#### 3. Static Files Not Loading
- **Cause:** Incorrect file paths or missing files
- **Solution:** 
  - Check file permissions (644 for files, 755 for folders)
  - Verify all static assets were uploaded
  - Check browser dev tools for 404 errors

#### 4. Session Issues
- **Cause:** Cookie domain mismatch or insecure cookies
- **Solution:**
  - Verify `NEXTAUTH_URL` is correct
  - Ensure SSL is properly configured
  - Check browser cookies for your domain

### Debug Mode

Enable debug mode temporarily by adding to your environment:
```env
NEXTAUTH_DEBUG=true
```

## Maintenance and Updates

### 1. Updating the Application

1. **Test locally:** Always test changes in development
2. **Build and test:** Run production build locally
3. **Backup current version:** Download current files from server
4. **Deploy new version:** Upload new build files
5. **Test in production:** Verify everything works correctly

### 2. Monitoring

Set up monitoring for:
- **Uptime:** Use services like UptimeRobot
- **Performance:** Monitor page load times
- **Errors:** Check server logs regularly
- **SSL expiry:** Monitor certificate expiration

### 3. Backup Strategy

1. **Weekly backups:** Download current application files
2. **Environment backup:** Securely store `.env.production`
3. **Database backup:** If using database in future
4. **Git tags:** Tag stable releases in repository

### 4. Security Updates

1. **Dependency updates:** Regularly update npm packages
2. **Security patches:** Monitor for security advisories
3. **SSL renewal:** Hostinger auto-renews, but monitor status
4. **Access reviews:** Regularly review who has access to hosting

## Deployment Checklist

### Pre-Deployment
- [ ] Google Cloud Console configured with production domain
- [ ] `.env.production` file created and configured
- [ ] Application builds successfully locally
- [ ] All tests pass
- [ ] SSL certificate ordered/configured

### Deployment
- [ ] Files uploaded to `public_html`
- [ ] `.htaccess` file uploaded and configured
- [ ] File permissions set correctly (644/755)
- [ ] Domain points to Hostinger servers
- [ ] SSL certificate is active

### Post-Deployment
- [ ] Website loads correctly at production URL
- [ ] Google OAuth sign-in works
- [ ] Protected routes redirect properly
- [ ] All static assets load correctly
- [ ] HTTPS redirect works
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable (Lighthouse score > 90)
- [ ] Security headers configured
- [ ] Error tracking configured (if applicable)

## Support Resources

- **Hostinger Support:** [https://support.hostinger.com](https://support.hostinger.com)
- **Next.js Deployment Docs:** [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **NextAuth.js Docs:** [https://next-auth.js.org](https://next-auth.js.org)
- **Google OAuth Documentation:** [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)

---

**Need help?** Check the troubleshooting section above or contact support with:
- Your domain name
- Hosting plan type
- Specific error messages
- Steps taken so far
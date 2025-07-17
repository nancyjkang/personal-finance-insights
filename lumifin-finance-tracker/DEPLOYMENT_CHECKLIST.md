# Hostinger Deployment Checklist

Use this checklist to ensure a successful deployment of Lumifin Finance Tracker to Hostinger.

## Pre-Deployment Checklist

### 🔧 Environment Setup
- [ ] **Google Cloud Console Project Created**
  - [ ] Google Sheets API enabled
  - [ ] Google+ API enabled (for OAuth)
  - [ ] OAuth 2.0 client ID created
  - [ ] OAuth consent screen configured

- [ ] **Production Environment Variables**
  - [ ] `.env.production` file created from template
  - [ ] `NEXTAUTH_SECRET` generated (min 32 characters)
  - [ ] `NEXTAUTH_URL` set to production domain
  - [ ] `GOOGLE_CLIENT_ID` from Google Cloud Console
  - [ ] `GOOGLE_CLIENT_SECRET` from Google Cloud Console
  - [ ] All placeholder values replaced with real ones

- [ ] **Domain and Hosting**
  - [ ] Hostinger hosting account active
  - [ ] Domain name registered and configured
  - [ ] DNS records pointing to Hostinger
  - [ ] Hosting plan suitable for application (Premium+ recommended)

### 🏗️ Application Preparation
- [ ] **Code Quality**
  - [ ] All tests passing: `npm test`
  - [ ] TypeScript compilation clean: `npm run type-check`
  - [ ] Linting passed: `npm run lint`
  - [ ] Application builds successfully: `npm run build`

- [ ] **Production Configuration**
  - [ ] `next.config.js` configured for Hostinger
  - [ ] Build optimization enabled
  - [ ] Security headers configured
  - [ ] Image optimization settings correct

## Deployment Process

### 🚀 Build and Prepare
- [ ] **Run Deployment Script**
  ```bash
  npm run deploy:prepare
  # or for static hosting:
  npm run deploy:static
  ```

- [ ] **Verify Build Output**
  - [ ] `dist/` directory created
  - [ ] All static files present
  - [ ] `.htaccess` file generated
  - [ ] Bundle size reasonable (< 10MB)

### 🌐 Google Cloud Console Configuration
- [ ] **Update OAuth Settings**
  - [ ] Add production redirect URI: `https://yourdomain.com/api/auth/callback/google`
  - [ ] Add www variant if applicable: `https://www.yourdomain.com/api/auth/callback/google`
  - [ ] Remove localhost/development URIs from production config
  - [ ] Test configuration in Google OAuth Playground (optional)

- [ ] **OAuth Consent Screen**
  - [ ] Application name updated
  - [ ] User support email set
  - [ ] Developer contact email set
  - [ ] Privacy policy URL added (if required)
  - [ ] Terms of service URL added (if required)
  - [ ] Authorized domains include your production domain

### 📁 File Upload to Hostinger
- [ ] **Access Hosting Panel**
  - [ ] Logged into Hostinger account
  - [ ] Accessed File Manager or connected via FTP
  - [ ] Navigated to `public_html` directory

- [ ] **Upload Files**
  - [ ] Uploaded all files from `dist/` directory
  - [ ] `.htaccess` file uploaded and properly placed
  - [ ] File permissions set correctly (644 for files, 755 for directories)
  - [ ] No sensitive files (.env, config files) uploaded

### 🔒 SSL and Security Setup
- [ ] **SSL Certificate**
  - [ ] Free SSL certificate enabled in Hostinger panel
  - [ ] Certificate status shows as "Active"
  - [ ] HTTPS redirect working
  - [ ] Mixed content warnings resolved

- [ ] **Security Verification**
  - [ ] HTTPS enforced (HTTP redirects to HTTPS)
  - [ ] Security headers present (check with browser dev tools)
  - [ ] No console errors related to security

## Post-Deployment Testing

### ✅ Functionality Testing
- [ ] **Basic Navigation**
  - [ ] Homepage loads correctly: `https://yourdomain.com`
  - [ ] Navigation menu works
  - [ ] All static assets load (CSS, JS, images)
  - [ ] No 404 errors in browser console

- [ ] **Authentication Flow**
  - [ ] Google Sign In button appears
  - [ ] Clicking sign-in redirects to Google
  - [ ] Google OAuth flow completes successfully
  - [ ] User redirected back to application
  - [ ] User profile information displays correctly
  - [ ] Protected routes accessible after login

- [ ] **Protected Routes**
  - [ ] `/dashboard` requires authentication
  - [ ] Unauthenticated users redirected to sign-in
  - [ ] `/auth/test` page works correctly
  - [ ] Session persists across browser refresh

### 📱 Cross-Platform Testing
- [ ] **Desktop Browsers**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (if on Mac)
  - [ ] Edge (latest)

- [ ] **Mobile Devices**
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] Responsive design works correctly
  - [ ] Touch interactions work properly

### ⚡ Performance Testing
- [ ] **Page Speed**
  - [ ] Homepage loads in < 3 seconds
  - [ ] Lighthouse score > 80 (Performance)
  - [ ] No render-blocking resources
  - [ ] Images optimized and loading properly

- [ ] **Google OAuth Performance**
  - [ ] Sign-in flow completes in reasonable time
  - [ ] No timeout errors during authentication
  - [ ] Session tokens refresh properly

## Production Monitoring Setup

### 📊 Analytics and Monitoring (Optional)
- [ ] **Error Tracking**
  - [ ] Sentry or similar error tracking configured
  - [ ] Test error reporting works
  - [ ] Alert notifications set up

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot or similar service configured
  - [ ] Monitoring both HTTP and HTTPS versions
  - [ ] Email/SMS alerts configured

### 🔍 SEO and Accessibility
- [ ] **SEO Basics**
  - [ ] Page titles and meta descriptions set
  - [ ] robots.txt file present (if needed)
  - [ ] sitemap.xml generated (if needed)
  - [ ] Google Search Console configured

- [ ] **Accessibility**
  - [ ] Lighthouse accessibility score > 90
  - [ ] Keyboard navigation works
  - [ ] Screen reader compatibility tested

## Troubleshooting Common Issues

### 🐛 If Google OAuth Doesn't Work
- [ ] Verify `NEXTAUTH_URL` exactly matches your domain
- [ ] Check Google Cloud Console redirect URIs include `/api/auth/callback/google`
- [ ] Ensure HTTPS is working (OAuth requires secure connections)
- [ ] Check browser console for specific error messages
- [ ] Verify Google Cloud Console project is in production mode

### 🐛 If Pages Don't Load Correctly
- [ ] Check `.htaccess` file is present and correct
- [ ] Verify all static files uploaded correctly
- [ ] Check file permissions (644 for files, 755 for directories)
- [ ] Look for 404 errors in browser dev tools
- [ ] Ensure mod_rewrite is enabled on server

### 🐛 If SSL Issues Occur
- [ ] Wait 15 minutes after enabling SSL (propagation time)
- [ ] Clear browser cache and cookies
- [ ] Check Hostinger SSL status in control panel
- [ ] Verify domain DNS is pointing to Hostinger correctly

## Final Verification

### 🎯 Go-Live Checklist
- [ ] **All core functionality working**
  - [ ] Authentication (sign in/out)
  - [ ] Protected routes
  - [ ] Session management
  - [ ] Mobile responsiveness

- [ ] **Performance acceptable**
  - [ ] Page load times < 3 seconds
  - [ ] No console errors
  - [ ] Lighthouse scores acceptable

- [ ] **Security verified**
  - [ ] HTTPS working
  - [ ] Security headers present
  - [ ] No sensitive data exposed

- [ ] **Monitoring active**
  - [ ] Uptime monitoring configured
  - [ ] Error tracking working
  - [ ] Analytics tracking (if applicable)

### 📝 Post-Deployment Documentation
- [ ] **Update Repository**
  - [ ] Deployment date recorded
  - [ ] Production URL documented
  - [ ] Any deployment-specific notes added

- [ ] **Team Communication**
  - [ ] Stakeholders notified of successful deployment
  - [ ] Support team briefed on any known issues
  - [ ] Monitoring team has access to dashboards

## 🎉 Deployment Complete!

Once all items are checked off, your Lumifin Finance Tracker should be successfully deployed to Hostinger!

### Next Steps
1. **Monitor for 24 hours** - Watch for any issues or performance problems
2. **Gather user feedback** - Test with real users to identify any edge cases
3. **Plan updates** - Establish a process for future deployments and updates

### Emergency Contacts
- **Hostinger Support**: https://support.hostinger.com
- **Google Cloud Console**: https://console.cloud.google.com
- **Repository Issues**: [Your GitHub repo]/issues

---

**Remember**: Keep this checklist updated as your deployment process evolves!
# Static Deployment Notice for Lumifin Finance Tracker

## Important: Authentication Limitations with Static Hosting

Due to the nature of static hosting (shared hosting on Hostinger), some features requiring server-side functionality will not work:

### What Works with Static Deployment:
- ✅ Homepage and basic navigation
- ✅ Static pages and content
- ✅ Client-side JavaScript functionality
- ✅ Responsive design and UI components

### What Does NOT Work with Static Deployment:
- ❌ **Google OAuth Authentication** (requires server-side API routes)
- ❌ **NextAuth.js session management** (requires server-side processing)
- ❌ **Protected routes** (relies on server-side authentication)
- ❌ **API endpoints** (no server-side processing available)
- ❌ **Google Sheets integration** (requires server-side API calls)

## Deployment Options

### Option 1: Static Deployment (Shared Hosting)
**Best for:** Landing pages, portfolios, documentation sites
**Hosting:** Hostinger shared hosting plans
**Limitations:** No authentication, no dynamic functionality

To deploy statically:
```bash
npm run build:static
npm run deploy:static
```

### Option 2: Server Deployment (VPS/Business Hosting) - RECOMMENDED
**Best for:** Full-featured applications with authentication
**Hosting:** Hostinger VPS or Business hosting plans with Node.js support
**Features:** Full Next.js functionality including authentication

To deploy with server functionality:
```bash
npm run build
npm run deploy:server
```

## Recommendation

For the **Lumifin Finance Tracker** with Google OAuth authentication and Google Sheets integration, you should use:

1. **Hostinger Business Hosting** or **VPS** (supports Node.js)
2. **Server deployment** option to maintain all functionality

The static deployment option is provided for reference but will result in a limited-functionality version of the application.

## Next Steps

1. Upgrade to Hostinger Business or VPS hosting
2. Use server deployment configuration
3. Follow the complete deployment guide in `HOSTINGER_DEPLOYMENT.md`

---

*This notice explains why static deployment has limited functionality for authentication-based applications.*
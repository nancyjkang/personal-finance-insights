# Google Cloud Console Setup Guide

This guide walks you through setting up Google OAuth 2.0 and Google Sheets API for the Lumifin Finance Tracker.

## Prerequisites

- Google account
- Access to Google Cloud Console
- A Google Sheets document with your financial data

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Enter project details:
   - **Project name**: `Lumifin Finance Tracker`
   - **Organization**: (optional, use your personal account)
5. Click "Create"
6. Wait for project creation and select the new project

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services → Library**
2. Search for and enable the following APIs:

### Google Sheets API
- Search: "Google Sheets API"
- Click on "Google Sheets API"
- Click "Enable"

### Google+ API (for user profile)
- Search: "Google+ API" 
- Click on "Google+ API"
- Click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: `Lumifin Finance Tracker`
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click "Save and Continue"
5. On "Scopes" page, click "Save and Continue" (we'll add scopes in code)
6. On "Test users" page, add your email as a test user
7. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first
4. Choose application type: **Web application**
5. Enter the details:
   - **Name**: `Lumifin Auth Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `https://your-production-domain.com` (add when you deploy)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-production-domain.com/api/auth/callback/google` (add when you deploy)
6. Click "Create"

## Step 5: Copy Credentials

1. After creation, you'll see a popup with your credentials
2. Copy the following values:
   - **Client ID**: Looks like `123456789-abc.apps.googleusercontent.com`
   - **Client Secret**: Random string of characters
3. Click "OK" to close the popup

## Step 6: Configure Environment Variables

1. In your project, copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   NEXTAUTH_SECRET=generate_random_32_char_string
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_from_url
   ```

3. Generate a random NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

## Step 7: Prepare Your Google Sheet

1. Create a Google Sheet with the following structure:

### Sheet 1: "Transactions"
| Date | Payer/Payee | Amount | Account | Category | Description | Tags |
|------|-------------|---------|---------|----------|-------------|------|
| 2024-01-15 | Grocery Store | -85.50 | Checking | Food & Dining | Weekly groceries | food,essentials |

### Sheet 2: "Account Settings"  
| Account Name | Initial Balance ($) |
|--------------|-------------------|
| Checking | 5000 |
| Savings | 10000 |

2. Make sure the sheet is accessible to your Google account
3. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

## Step 8: Verify Setup

After completing the setup:

1. Your `.env.local` should have all values filled in
2. Your Google Cloud project should have:
   - Google Sheets API enabled
   - Google+ API enabled  
   - OAuth 2.0 client configured
   - OAuth consent screen configured
3. Your Google Sheet should be properly formatted

## Troubleshooting

### Common Issues:

**"Access blocked" error:**
- Make sure your email is added as a test user in OAuth consent screen
- Verify the redirect URI matches exactly

**"Invalid client" error:**
- Check that CLIENT_ID and CLIENT_SECRET are correct
- Verify the redirect URI is authorized in Google Cloud Console

**Sheet access errors:**
- Ensure the sheet is shared with your Google account
- Verify the Spreadsheet ID is correct

**Development vs Production:**
- For development: Use `http://localhost:3000`
- For production: Add your actual domain to authorized origins/redirects

## Security Notes

- Never commit `.env.local` to version control
- Keep your Client Secret secure
- Use different OAuth clients for development and production
- Regularly rotate your NextAuth secret in production

## Next Steps

Once setup is complete, the application will be able to:
1. Authenticate users with Google OAuth
2. Access Google Sheets with user permission
3. Read transaction and account data
4. Provide secure session management

Ready to proceed with NextAuth.js configuration!
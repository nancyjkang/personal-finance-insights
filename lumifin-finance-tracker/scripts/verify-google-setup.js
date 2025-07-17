#!/usr/bin/env node

/**
 * Google Setup Verification Script
 * Run this script to verify your Google Cloud Console setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Google Setup Configuration...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env.local file not found');
  console.log('   Please copy .env.example to .env.local and fill in your values\n');
  process.exit(1);
}

// Read environment variables
require('dotenv').config({ path: envPath });

const checks = [
  {
    name: 'Google Client ID',
    key: 'GOOGLE_CLIENT_ID',
    validate: (value) => value && value.includes('.apps.googleusercontent.com'),
    error: 'Should end with .apps.googleusercontent.com'
  },
  {
    name: 'Google Client Secret',
    key: 'GOOGLE_CLIENT_SECRET',
    validate: (value) => value && value.length > 10 && !value.includes('your_'),
    error: 'Should be a valid secret from Google Cloud Console'
  },
  {
    name: 'NextAuth Secret',
    key: 'NEXTAUTH_SECRET',
    validate: (value) => value && value.length >= 32 && !value.includes('your_'),
    error: 'Should be at least 32 characters long (use: openssl rand -base64 32)'
  },
  {
    name: 'NextAuth URL',
    key: 'NEXTAUTH_URL',
    validate: (value) => value && (value.startsWith('http://localhost:3000') || value.startsWith('https://')),
    error: 'Should be http://localhost:3000 for development'
  },
  {
    name: 'Google Spreadsheet ID',
    key: 'GOOGLE_SPREADSHEET_ID',
    validate: (value) => value && value.length > 20 && !value.includes('your_'),
    error: 'Should be the ID from your Google Sheets URL'
  }
];

let allValid = true;

checks.forEach(check => {
  const value = process.env[check.key];
  const isValid = check.validate(value);
  
  console.log(`${isValid ? '✅' : '❌'} ${check.name}`);
  
  if (!isValid) {
    console.log(`   ${check.error}`);
    if (value) {
      console.log(`   Current value: ${value.substring(0, 20)}...`);
    } else {
      console.log(`   Current value: (not set)`);
    }
    allValid = false;
  }
  console.log('');
});

if (allValid) {
  console.log('🎉 All configuration checks passed!');
  console.log('   Your Google setup appears to be correctly configured.');
  console.log('   You can now proceed with NextAuth.js setup.\n');
} else {
  console.log('⚠️  Some configuration issues found.');
  console.log('   Please fix the issues above before proceeding.\n');
  process.exit(1);
}

// Additional helpful information
console.log('📋 Quick Setup Checklist:');
console.log('   □ Google Cloud project created');
console.log('   □ Google Sheets API enabled');
console.log('   □ Google+ API enabled');
console.log('   □ OAuth consent screen configured');
console.log('   □ OAuth 2.0 client created');
console.log('   □ Redirect URIs configured');
console.log('   □ Test user added (your email)');
console.log('   □ Google Sheet created with proper structure');
console.log('   □ Environment variables configured');
console.log('');
console.log('🚀 Next step: npm run dev and test authentication');
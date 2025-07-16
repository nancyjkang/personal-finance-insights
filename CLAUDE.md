# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lumifin Personal Finance Tracker v1.0** - A secure web application that connects to Google Sheets for personal finance management.

### Tech Stack
- **Frontend**: React/Next.js
- **Backend**: Node.js/Express or serverless functions
- **Database**: Google Sheets (via Google Sheets API)
- **Authentication**: Google OAuth 2.0
- **Deployment**: Vercel/Netlify

### Core Features
1. Google Sheets integration for transactions and account settings
2. User authentication via Google Sign-In
3. Transactions dashboard with filtering and sorting
4. Monthly reports (income, expense, savings, categories)
5. Transaction categorization with user-defined categories
6. Responsive, mobile-friendly UI

### Google Sheet Structure
- **Sheet 1: Transactions** - Date, Payer/Payee, Amount, Account, Category, Description, Tags
- **Sheet 2: Account Settings** - Account Name, Initial Balance

## Development Commands

### Project Setup (Once implemented)
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add Google API credentials and other keys to .env

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

### Google API Setup
1. Create project in Google Cloud Console
2. Enable Google Sheets API and Google Sign-In
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs
5. Store credentials in `.env`

## Task Management with Task Master AI

### Initial Setup
```bash
# Parse the PRD to generate tasks
task-master parse-prd scripts/prd.txt

# Analyze and expand tasks
task-master analyze-complexity --research
task-master expand --all --research
```

### Development Workflow
```bash
# Get next task
task-master next

# View task details
task-master show <id>

# Mark task in progress
task-master set-status --id=<id> --status=in-progress

# Log implementation notes
task-master update-subtask --id=<id> --prompt="implementation details"

# Complete task
task-master set-status --id=<id> --status=done
```

### Key Task Master Commands
- `task-master list` - View all tasks
- `task-master add-task --prompt="description" --research` - Add new task
- `task-master expand --id=<id> --research` - Break down task
- `task-master validate-dependencies` - Check task dependencies

## Architecture Guidelines

### Frontend Structure (Once implemented)
```
src/
├── components/         # Reusable UI components
├── pages/             # Next.js pages or React routes
├── services/          # API calls and Google Sheets integration
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
└── styles/            # CSS/styling files
```

### Backend Structure (Once implemented)
```
server/
├── api/               # API endpoints
├── auth/              # Authentication logic
├── services/          # Business logic
└── utils/             # Helper functions
```

### Key Implementation Considerations

1. **Security**
   - Never expose API keys in client-side code
   - Use environment variables for sensitive data
   - Implement proper CORS policies
   - Validate all user inputs

2. **Google Sheets Integration**
   - Use batch operations for performance
   - Implement caching to reduce API calls
   - Handle rate limiting gracefully
   - Consider real-time sync strategies

3. **State Management**
   - Consider using Context API or Redux for global state
   - Cache transaction data locally
   - Implement optimistic updates

4. **Performance**
   - Lazy load components
   - Implement pagination for large datasets
   - Use memo/callback for expensive operations
   - Consider virtual scrolling for long lists

## Environment Variables

Required environment variables (see `.env.example`):
```
# Google API
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_SHEETS_API_KEY=

# Task Master AI (for development workflow)
ANTHROPIC_API_KEY=
PERPLEXITY_API_KEY=  # For research features

# Application
NEXT_PUBLIC_APP_URL=
SESSION_SECRET=
```

## Testing Strategy

### Unit Tests
- Test Google Sheets API wrapper functions
- Test authentication flows
- Test data transformation utilities
- Test filtering and sorting logic

### Integration Tests
- Test complete authentication flow
- Test data sync with Google Sheets
- Test transaction CRUD operations

### E2E Tests
- Test user journey from login to viewing transactions
- Test filtering and category updates
- Test responsive design on different devices

## Task Master AI Integration

### MCP Configuration
Already configured in `.mcp.json` for Claude Code integration.

### Custom Slash Commands
Create in `.claude/commands/`:
- `/next-task` - Get and show next task
- `/complete-task` - Mark current task done

### Tool Allowlist
Configured in `.claude/settings.json` for Task Master and development tools.

## Development Tips

1. **Before Starting Implementation**
   - Review the PRD in `scripts/prd.txt`
   - Check Task Master for current task status
   - Understand Google Sheets API limitations

2. **During Implementation**
   - Log progress with `task-master update-subtask`
   - Test Google API calls with minimal data first
   - Implement error boundaries for API failures

3. **Common Pitfalls to Avoid**
   - Don't store sensitive data in localStorage
   - Always handle Google API quota errors
   - Implement proper loading states
   - Test with various Google Sheet formats

## Current Project Status

**Pre-Implementation Phase**
- PRD defined in `scripts/prd.txt`
- Task Master AI configured
- No code implementation started yet
- Next step: Initialize React/Next.js project

To begin implementation:
1. Run `task-master next` to get first task
2. Initialize the chosen framework (React/Next.js)
3. Set up development environment
4. Follow tasks systematically
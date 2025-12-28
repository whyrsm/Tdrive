# Security Best Practices

## Rule
Never commit secrets, credentials, or sensitive data to version control.

## Environment Variables
- Store all secrets in `.env` files
- Always add `.env` to `.gitignore`
- Provide `.env.example` with placeholder values
- Use different env files per environment (.env.local, .env.production)

## What NOT to Commit
- API keys and tokens
- Database credentials
- Private keys and certificates
- Passwords and secrets
- Personal access tokens
- AWS/cloud credentials

## Before Committing
1. Check `git diff` for any hardcoded secrets
2. Verify `.env` is in `.gitignore`
3. Use environment variables for all sensitive config

## If You Accidentally Commit Secrets
1. Rotate the exposed credentials immediately
2. Remove from git history using `git filter-branch` or BFG
3. Force push the cleaned history

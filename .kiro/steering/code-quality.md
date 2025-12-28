# Code Quality & Security

## Before Committing
1. Run `npm run lint` and `npm run format`
2. Check `git diff` for hardcoded secrets
3. Never commit `.env` files (use `.env.example` for templates)

## Secrets
Store in `.env` files: API keys, DB credentials, tokens, passwords, private keys.

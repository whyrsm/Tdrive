# Git Branch Workflow

## Rule
Before starting any new feature, improvement, or bug fix, always create a dedicated branch from an up-to-date `main` branch.

## Branch Naming Convention
- `feature/` - for new features (e.g., `feature/add-file-upload`)
- `fix/` - for bug fixes (e.g., `fix/login-redirect-issue`)
- `improve/` - for improvements (e.g., `improve/file-service-performance`)
- `refactor/` - for code refactoring (e.g., `refactor/drive-store`)

## Workflow Reminder
1. Switch to main and pull latest: `git checkout main && git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature-name`
3. Make commits with clear messages
4. Push and create PR when ready: `git push -u origin feature/your-feature-name`

## Important
- Never commit directly to `main` branch
- Keep branches focused on a single feature/fix
- Delete branches after merging

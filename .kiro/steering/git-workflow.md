# Git Workflow (Solo Development)

## Branch Structure
- `main` - Production-ready code
- `development` - Active development (default working branch)

## Daily Workflow
1. Work directly on `development` for most changes
2. Commit frequently with clear messages
3. Push when ready: `git push origin development`
4. Merge to `main` only for releases/deployments

## When to Use Feature Branches
Only create a branch when:
- Experimenting with something you might abandon
- Working on a large feature (multi-day) you want to isolate
- Need to switch context and preserve work-in-progress

```bash
# If needed:
git checkout -b feature/experimental-thing
# ... work ...
git checkout development && git merge feature/experimental-thing
git branch -d feature/experimental-thing
```

## Agent Behavior
- Commit directly to `development` unless instructed otherwise
- Never commit to `main` — that's for user-controlled releases

## Tips
- Small, frequent commits > large, infrequent ones
- Keep `development` in a working state
- Use `git stash` for quick context switches

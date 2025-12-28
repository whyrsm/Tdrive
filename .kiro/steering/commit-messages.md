# Conventional Commits

## Rule
Use conventional commit format for all commit messages.

## Format
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

## Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code refactoring (no feature/fix)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (deps, configs, etc.)
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

## Examples
```
feat(auth): add Telegram login support
fix(files): resolve upload timeout issue
docs(readme): update installation steps
chore(deps): upgrade NestJS to v10
```

## Tips
- Keep subject line under 50 characters
- Use imperative mood ("add" not "added")
- Don't end subject with period

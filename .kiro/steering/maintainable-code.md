---
inclusion: manual
---
# Maintainable Code

## Principles
- Single responsibility: one function = one job
- Small functions (20-30 lines max)
- Meaningful names: `isLoading`, `fetchUser`, `canEdit`
- DRY: extract repeated logic
- Max 2-3 levels of nesting, use early returns

## TypeScript
- Avoid `any`, use `unknown` if needed
- Explicit return types for public functions
- Use `?.` and `??` for null safety

## Error Handling
- Never swallow errors silently
- Provide meaningful error messages
- Use custom error types for domain errors

## Avoid
- God classes/functions
- Commented-out code
- Console.log in production
- Ignoring linter warnings

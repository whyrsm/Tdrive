# Testing Guidelines

## Rule
Add or update tests when creating new features or fixing bugs.

## When to Write Tests
- New feature: Add unit tests for new logic
- Bug fix: Add test that reproduces the bug first
- Refactoring: Ensure existing tests still pass
- API changes: Update integration tests

## Test Types
- **Unit tests**: Test individual functions/methods
- **Integration tests**: Test API endpoints, database operations
- **E2E tests**: Test complete user flows

## Before Committing
1. Run existing tests: `npm test`
2. Ensure new code has test coverage
3. All tests should pass before pushing

## Tips
- Write tests that describe behavior, not implementation
- Use descriptive test names
- Keep tests focused and independent
- Mock external dependencies

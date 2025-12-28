# Code Quality

## Rule
Always run linting and formatting before committing code.

## Before Committing
1. Run linter: `npm run lint` or `npx eslint .`
2. Run formatter: `npm run format` or `npx prettier --write .`
3. Fix any errors or warnings before committing

## Tips
- Set up pre-commit hooks with husky + lint-staged for automation
- Configure your IDE to format on save
- Address linting warnings, don't just ignore them

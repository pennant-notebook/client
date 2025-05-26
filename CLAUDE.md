# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Tests:
  - Unit tests: `npm test` or `npm run test:unit`
  - Integration tests: `npm run test:integration`
  - Component tests: `npm run test:component` 
  - E2E tests: `npm run test:e2e`
  - All tests: `npm run test:all`

## Test Structure
- `tests/unit/` - Unit tests using Vitest + Testing Library
- `tests/integration/` - Integration tests using Vitest
- `tests/component/` - Component integration tests using Playwright (require running app)
- `tests/e2e/` - End-to-end tests using Playwright
- `tests/fixtures/` - Test data and mock objects
- `tests/utils/` - Test utilities and setup files

## Code Style Guidelines
- TypeScript with strict typing
- Use React functional components with hooks
- Import paths: use '@/' for types, '~/' for src files
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Each component should have its own module.css file
- Use Recoil for state management
- Error handling: use try/catch with specific error types
- Add data-test attributes for component testing
- Maintain consistent component structure: props types, state, effects, handlers, JSX
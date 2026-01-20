# AGENTS.md

This file provides guidance for coding agents working in this Obsidian-Mate plugin repository.

## Development Commands

```bash
# Build & Development
npm run build              # Production build (TypeScript check + minified output)
npm run dev                # Start development (tailwind + esbuild watch)
npm run build:tailwind     # Build CSS only
npm run build:esbuild      # Build JS only

# Code Quality
npm run lint               # Run ESLint checks
npm run lint:fix           # Auto-fix ESLint issues
npm run format             # Format code with Prettier
npm run format:check       # Check formatting without changes

# Testing
npm test                   # Run unit tests (excludes integration tests)
npm run test:integration   # Run integration tests (requires API keys)
npx jest --testPathPattern="test-name"  # Run single test file
npm test -- -t "test name"  # Run single test by name

# Before PR: run both
npm run format && npm run lint
```

## Code Style Guidelines

### TypeScript

- **Strict mode** enabled: no implicit any, strict null checks
- **Absolute imports** with `@/` prefix: `import { Foo } from "@/path"`
- Paths configured in `tsconfig.json`: `"@/*": ["src/*"]`
- Use `interface` for object shapes, `type` for unions/aliases
- Prefer `const` assertions and type inference

### React

- Functional components only (no class components)
- Use custom hooks for reusable logic
- Props interfaces defined above components
- Avoid inline styles—use Tailwind CSS classes
- ESLint rule: `react-hooks/exhaustive-deps` is enforced

### General

- **File naming**: PascalCase for components, camelCase for utilities
- **Imports order**: React → external → internal (absolute imports first)
- **Async/await** over promises; use early returns for errors
- **Always add JSDoc comments** for all functions and methods
- **Never use console.log**—use logger utilities:
  ```typescript
  import { logInfo, logWarn, logError } from "@/logger";
  ```

### ESLint Rules (Key Points)

- `@typescript-eslint/no-unused-vars`: error (args ignored)
- `react-hooks/exhaustive-deps`: error
- Tailwind CSS classnames must be valid and ordered
- No `any` type suppression allowed

### Prettier Configuration

```json
{ "printWidth": 100, "tabWidth": 2, "semi": true, "singleQuote": false, "trailingComma": "es5" }
```

## Cursor Rules (Must Follow)

1. **Always use functions from logger.ts for logging** (never console.log)
2. **Use "npx" command to run tests** (not npm test directly)

## Major Principles

- **Write generalizable solutions**: Never add hardcoded logic for specific edge cases
- **Never modify AI prompt content**: System prompts and model adapters are off-limits
- **Configuration over convention**: If behavior varies, make it configurable
- **Avoid language-specific lists**: Use language-agnostic approaches

## Architecture Overview

- **Message Management**: `MessageRepository` (single source of truth) → `ChatManager` → `ChatUIState`
- **LLM Providers**: OpenAI, Anthropic, Google, Azure, local models in `src/LLMProviders/`
- **UI Components**: React + Radix UI + Tailwind CSS in `src/components/`
- **Plugin Entry**: `src/main.ts` extends Obsidian Plugin
- **Global `app`**: Obsidian API is globally available (no import needed)

## Testing

- Jest with TypeScript support
- Mock Obsidian API for plugin tests
- Integration tests require `.env.test` with API keys
- Test files adjacent to implementation (`.test.ts`)

# TypeScript Migration & Modern Architecture

**Category:** Architecture
**Quarter:** Q1
**T-shirt Size:** L

## Why This Matters

This is the foundational initiative that unlocks everything else. The irony is palpable: `drizzle-init` generates TypeScript files but is itself written in JavaScript. This creates a credibility gap with users who expect a TypeScript-first tool for a TypeScript ORM.

Beyond credibility, migrating to TypeScript enables type-safe templates, better IDE support for contributors, and catches bugs at compile time rather than runtime. The current architecture also has technical debt—callback-style file operations, global mutable state, and a monolithic entry point—that will slow down all future development.

## Current State

- Pure JavaScript (ES Modules) codebase
- Uses old-style `fs.readFile`/`fs.writeFile` with callbacks instead of promises
- Global mutable state (`let TEMPLATE`, `let PROVIDER`, etc.)
- Single 194-line `index.js` entry point handling all logic
- No separation between CLI logic, template generation, and file operations
- Templates are inline strings within function bodies
- No type safety for database/provider combinations

## Proposed Future State

A modern, modular TypeScript codebase with:

- **Clear separation of concerns**: CLI layer, business logic, file system abstraction, template engine
- **Type-safe provider configurations**: A `DatabaseProvider` type system that makes invalid combinations impossible
- **Async/await throughout**: No callbacks, proper error handling with typed errors
- **Dependency injection**: Making the codebase testable and extensible
- **Build pipeline**: TypeScript compilation, bundling, and source maps
- **Strict TypeScript**: `strict: true`, no `any` types

```
src/
├── cli/
│   ├── commands/
│   │   └── init.ts
│   ├── prompts/
│   │   ├── database.ts
│   │   └── provider.ts
│   └── index.ts
├── core/
│   ├── generator.ts
│   ├── file-system.ts
│   └── project.ts
├── templates/
│   ├── configs/
│   ├── schemas/
│   └── connections/
├── types/
│   ├── database.ts
│   └── provider.ts
└── index.ts
```

## Key Deliverables

- [ ] Set up TypeScript configuration with strict mode
- [ ] Configure build pipeline (tsup or unbuild for bundling)
- [ ] Define type system for database/provider combinations
- [ ] Migrate `index.js` to modular CLI architecture
- [ ] Convert all callbacks to async/await
- [ ] Extract templates to separate template files
- [ ] Add proper error types and error handling
- [ ] Create file system abstraction layer
- [ ] Set up source maps for debugging
- [ ] Update CI/CD for TypeScript builds
- [ ] Add Ultracite with Biome
- [ ] Use tsdown for build
- [ ] Document architecture decisions (ADRs)

## Prerequisites

None — this is the foundational initiative.

## Risks & Open Questions

- **Migration strategy**: Big-bang rewrite vs incremental migration? Incremental is safer but may extend timeline
- **Bundle size**: TypeScript can bloat the final package. Need to optimize with tree-shaking
- **Node.js version**: What's the minimum supported version? This affects which TS features we can use
- **Breaking changes**: API changes during restructuring may break users relying on current behavior

## Notes

Key files to migrate in order:
1. `utils/schema.js` → `src/templates/schemas/`
2. `utils/db.js` → `src/templates/connections/`
3. `utils/drizzleConfig.js` → `src/templates/configs/`
4. `utils/updateScripts.js` → `src/core/project.ts`
5. `index.js` → `src/cli/` (split into multiple modules)

The current codebase is ~500 lines total, which is manageable for a focused migration sprint.

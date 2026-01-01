# Comprehensive Testing Suite

**Category:** Testing
**Quarter:** Q1
**T-shirt Size:** M

## Why This Matters

The current test script is `echo "Error: no test specified" && exit 1`. For a CLI tool that modifies user projects—writing files, updating `package.json`—this is a ticking time bomb. Every release risks shipping broken templates, invalid configurations, or file system operations that fail on edge cases.

Testing is the foundation of confidence. It enables:
- **Fearless refactoring** during the TypeScript migration
- **Community contributions** without fear of breaking existing functionality
- **Template validation** ensuring generated code is syntactically correct
- **Cross-platform reliability** especially for Windows users

## Current State

- No test files exist
- No testing framework configured
- No CI/CD test step
- Templates are unchecked strings that could contain syntax errors
- File operations untested on different operating systems
- README explicitly lists "Implement unit tests" as a TODO

## Proposed Future State

A comprehensive testing strategy covering:

- **Unit tests** for all pure functions (template generation, configuration building)
- **Integration tests** for file system operations with temporary directories
- **Snapshot tests** for generated templates ensuring consistency
- **End-to-end tests** simulating full CLI runs
- **Template validation** ensuring generated TypeScript/JavaScript compiles
- **Cross-platform CI** testing on Linux, macOS, and Windows
- **Code coverage** with minimum thresholds (80%+)

```
tests/
├── unit/
│   ├── templates/
│   │   ├── schema.test.ts
│   │   ├── db.test.ts
│   │   └── config.test.ts
│   └── core/
│       └── generator.test.ts
├── integration/
│   ├── file-operations.test.ts
│   └── project-update.test.ts
├── e2e/
│   └── full-flow.test.ts
├── fixtures/
│   └── sample-projects/
└── helpers/
    └── test-utils.ts
```

## Key Deliverables

- [ ] Select and configure testing framework (Vitest recommended for TS)
- [ ] Set up code coverage with c8 or vitest coverage
- [ ] Create unit tests for all template generation functions
- [ ] Create integration tests for file system operations
- [ ] Add snapshot tests for every database/provider combination
- [ ] Implement template syntax validation (compile generated TS)
- [ ] Set up GitHub Actions matrix for cross-platform testing
- [ ] Add pre-commit hooks for running tests
- [ ] Configure coverage thresholds in CI
- [ ] Create test fixtures for sample project scenarios
- [ ] Document testing conventions and how to add new tests

## Prerequisites

- **Initiative 01**: TypeScript migration makes testing easier with type safety

## Risks & Open Questions

- **Testing CLI interactions**: How to test interactive prompts? Mocking inquirer or using programmatic API?
- **File system isolation**: Tests must not pollute the real file system. Need proper temp directory handling
- **Template validation scope**: Do we validate templates compile, or also that they work with actual databases?
- **CI time**: Full cross-platform matrix can be slow. May need test splitting

## Notes

Key testing priorities by risk:
1. **Template generation** - high risk, easy to test
2. **package.json updates** - medium risk, need fixtures
3. **Directory creation** - low risk, but platform-specific edge cases
4. **CLI flow** - medium risk, requires prompt mocking

Consider using `memfs` for file system mocking in unit tests, reserving real filesystem for integration tests.

Current provider combinations to test (each combination is a test case):
- PostgreSQL: 10 providers × 1 database = 10 combinations
- MySQL: 4 providers × 1 database = 4 combinations
- SQLite: 7 providers × 1 database = 7 combinations
- **Total: 21 template combinations to cover**

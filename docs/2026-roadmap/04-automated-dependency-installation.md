# Automated Dependency Installation

**Category:** DX Improvement
**Quarter:** Q1
**T-shirt Size:** S

## Why This Matters

After running `drizzle-init`, users face a frustrating experience: they have configuration files that reference packages they haven't installed. The generated `db.ts` imports from `@neondatabase/serverless`, but the user must manually figure out and install:

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

This is error-prone and breaks the "zero to working" promise. Users hit immediate errors when trying to use the generated code. Every scaffolding tool worth its salt—Create React App, Vite, create-next-app—installs dependencies automatically.

## Current State

- No automatic dependency installation
- Users must manually research and install packages
- Different providers require different packages (not documented in CLI)
- Easy to miss development dependencies (`drizzle-kit`)
- No detection of user's package manager preference (npm/yarn/pnpm/bun)
- Generated code references uninstalled packages

## Proposed Future State

After selecting a database and provider:

1. **Detect package manager**: Check for lockfiles to determine npm/yarn/pnpm/bun
2. **Prompt to install**: "Install dependencies? (Y/n)" with clear list shown
3. **Install automatically**: Run the appropriate install command
4. **Verify installation**: Confirm packages are in `package.json`
5. **Handle errors gracefully**: Network issues, permission problems

```
? Install dependencies using npm? (Y/n)

  Dependencies to install:
    drizzle-orm
    @neondatabase/serverless

  Dev dependencies:
    drizzle-kit
    @types/node (if TypeScript project detected)

Installing dependencies...
✓ drizzle-orm@0.30.0
✓ @neondatabase/serverless@0.9.0
✓ drizzle-kit@0.21.0 (dev)

All dependencies installed successfully!
```

## Key Deliverables

- [ ] Create package manager detection (npm, yarn, pnpm, bun)
- [ ] Build dependency manifest for each provider
- [ ] Implement installation command execution
- [ ] Add user prompt for installation confirmation
- [ ] Handle installation errors with helpful messages
- [ ] Detect TypeScript projects and add type packages
- [ ] Add `--skip-install` flag for CI/automation
- [ ] Support offline mode / cache awareness
- [ ] Add version pinning strategy for stability
- [ ] Create fallback for monorepo detection

## Prerequisites

None — can be implemented on current codebase, but benefits from TypeScript migration for type-safe dependency manifests.

## Risks & Open Questions

- **Package manager detection accuracy**: Edge cases with multiple lockfiles?
- **Version pinning**: Pin exact versions or use ranges?
- **Monorepo support**: Install at root or in specific workspace?
- **Network failures**: How to handle partial installations?
- **Conflicting versions**: What if user already has incompatible versions?

## Notes

Package manager detection priority:
1. `bun.lockb` → Bun
2. `pnpm-lock.yaml` → pnpm
3. `yarn.lock` → Yarn
4. `package-lock.json` → npm
5. None → Ask user or default to npm

Dependency mappings to create (sample):
```javascript
{
  "PostgreSQL": {
    "Neon": {
      deps: ["drizzle-orm", "@neondatabase/serverless"],
      devDeps: ["drizzle-kit"]
    },
    "Supabase": {
      deps: ["drizzle-orm", "postgres"],
      devDeps: ["drizzle-kit"]
    }
  }
  // ... etc
}
```

Consider using `execa` for cross-platform command execution and `ora` for spinners during installation.

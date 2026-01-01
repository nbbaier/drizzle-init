# Plugin Architecture

**Category:** Architecture
**Quarter:** Q2
**T-shirt Size:** XL

## Why This Matters

The database ecosystem is exploding. New providers emerge monthly—CockroachDB, TimescaleDB, SingleStore, Deno KV, countless more. The current architecture requires modifying core source files for each new provider, creating a bottleneck where every addition needs maintainer review and release.

A plugin architecture transforms `drizzle-init` from a closed tool into an open platform. Community members can create plugins for their preferred providers, frameworks, or deployment targets without waiting for core updates. This is the difference between "a CLI tool" and "an ecosystem."

## Current State

- Adding a new provider requires modifying `utils/db.js`, `utils/schema.js`, and `utils/drizzleConfig.js`
- Switch statements span hundreds of lines for provider handling
- No way for users to add custom templates
- No extension points in the codebase
- Tight coupling between CLI logic and provider implementations

## Proposed Future State

A plugin system where:

- **Core is minimal**: The main package handles CLI, file operations, and plugin orchestration
- **Providers are plugins**: Each database/provider can be its own npm package
- **Custom plugins**: Users can create organization-specific plugins
- **Plugin discovery**: CLI can search for and install plugins dynamically
- **Composition**: Plugins can depend on and extend other plugins

```
# Core package
drizzle-init

# Official plugins (separate packages)
@drizzle-init/plugin-postgres-neon
@drizzle-init/plugin-postgres-supabase
@drizzle-init/plugin-mysql-planetscale
@drizzle-init/plugin-sqlite-turso

# Community plugins
drizzle-init-plugin-cockroachdb
drizzle-init-plugin-timescale
drizzle-init-plugin-my-company-template
```

Plugin interface:
```typescript
interface DrizzleInitPlugin {
  name: string;
  version: string;
  type: 'database' | 'provider' | 'template' | 'framework';

  // For provider plugins
  database?: 'postgresql' | 'mysql' | 'sqlite';

  // Templates this plugin provides
  templates: {
    schema?: (config: PluginConfig) => string;
    db?: (config: PluginConfig) => string;
    config?: (config: PluginConfig) => string;
  };

  // Environment variables required
  envVars?: EnvVarDefinition[];

  // npm packages to install
  dependencies?: PackageDependency[];

  // Hooks for extending CLI behavior
  hooks?: {
    beforeGenerate?: () => Promise<void>;
    afterGenerate?: () => Promise<void>;
  };
}
```

## Key Deliverables

- [ ] Design plugin interface specification
- [ ] Create plugin loading mechanism (local files + npm packages)
- [ ] Extract current providers into reference plugins
- [ ] Implement plugin discovery and installation commands
- [ ] Create plugin validation and security sandboxing
- [ ] Build plugin development toolkit (create-drizzle-init-plugin)
- [ ] Set up plugin registry or use npm with conventions
- [ ] Create comprehensive plugin development documentation
- [ ] Migrate at least 5 providers to plugin format as proof of concept
- [ ] Implement plugin versioning and compatibility checks
- [ ] Add plugin configuration/settings support

## Prerequisites

- **Initiative 01**: TypeScript architecture provides clean extension points
- **Initiative 02**: Testing infrastructure for plugin validation

## Risks & Open Questions

- **Security**: Plugins execute code. How to sandbox or verify plugins?
- **Version compatibility**: How to handle plugins that require specific core versions?
- **Discovery**: Centralized registry vs npm conventions vs GitHub topics?
- **Maintenance burden**: Official plugins need maintenance. Who owns them?
- **User experience**: How to keep CLI simple while supporting plugins?

## Notes

Similar successful plugin architectures to study:
- **ESLint plugins**: `eslint-plugin-*` convention
- **Gatsby plugins**: Rich plugin API with hooks
- **Vite plugins**: Simple but powerful interface
- **Prisma generators**: Good model for ORM-adjacent tooling

Plugin priority for extraction:
1. Neon (most popular PostgreSQL serverless)
2. Turso (growing SQLite ecosystem)
3. PlanetScale (popular MySQL)
4. Supabase (huge community)
5. Cloudflare D1 (growing edge database)

Consider `cosmiconfig` for plugin configuration file discovery.

# Interactive Documentation System

**Category:** Documentation
**Quarter:** Q1
**T-shirt Size:** S

## Why This Matters

CLI tools often suffer from discoverability problems. Users install, run once, and then forget what commands are available or how to accomplish specific tasks. The current README is static and external—users must leave the terminal to find help.

An interactive documentation system brings help directly into the CLI experience. Contextual hints, searchable documentation, and guided tutorials make `drizzle-init` approachable for newcomers while providing quick reference for experienced users.

## Current State

- README.md is the only documentation
- No `--help` output beyond basic commander defaults
- No explanation of what generated files do
- No troubleshooting guides
- No documentation for different providers
- README TODOs mention "Write detailed documentation for each command and option"

## Proposed Future State

Multi-layered documentation in the CLI:

**Quick help:**
```bash
$ drizzle-init --help

🌧️ drizzle-init v2.0.0

USAGE
  $ drizzle-init [command] [options]

COMMANDS
  init      Initialize Drizzle ORM in your project (default)
  migrate   Manage database migrations
  doctor    Check your Drizzle setup health
  docs      Browse documentation

OPTIONS
  --database, -d    Database type (postgres, mysql, sqlite)
  --provider, -p    Database provider (neon, supabase, turso, ...)
  --template, -t    Schema template to use
  --skip-install    Skip dependency installation
  --yes, -y         Accept all defaults

EXAMPLES
  $ drizzle-init
  $ drizzle-init -d postgres -p neon
  $ drizzle-init --template auth-oauth

Run 'drizzle-init docs' for interactive documentation.
```

**Interactive docs:**
```bash
$ drizzle-init docs

? What would you like to learn about?
  > Getting Started
    Database Providers
    Schema Templates
    Migrations
    Framework Guides
    Troubleshooting
    Configuration Reference

─────────────────────────────────

? Select a provider to learn about:
  > Neon (PostgreSQL)
    Supabase (PostgreSQL)
    Turso (SQLite)
    PlanetScale (MySQL)
    ...

───────────────────────────────────────────────────────────────
NEON (PostgreSQL)

Neon is a serverless Postgres provider with automatic scaling
and branching capabilities.

SETUP
  1. Create account at https://neon.tech
  2. Create a new project
  3. Copy connection string from dashboard
  4. Run: drizzle-init -d postgres -p neon

CONNECTION STRING FORMAT
  postgres://user:password@ep-xxx.region.aws.neon.tech/dbname

ENVIRONMENT VARIABLES
  DATABASE_URL - Your Neon connection string

TIPS
  • Enable connection pooling for serverless deployments
  • Use database branching for preview environments

[↑/↓] Navigate  [enter] Select  [b] Back  [q] Quit
───────────────────────────────────────────────────────────────
```

**Contextual hints after generation:**
```
✓ Files generated successfully!

📚 NEXT STEPS

1. Set your DATABASE_URL environment variable:
   export DATABASE_URL="postgres://..."

2. Install dependencies (if skipped):
   npm install

3. Push your schema to the database:
   npm run db:push

4. Open Drizzle Studio to explore your database:
   npm run db:studio

💡 TIP: Run 'drizzle-init doctor' to verify your setup.
📖 DOCS: Run 'drizzle-init docs' for detailed guides.
```

## Key Deliverables

- [ ] Enhance `--help` output with examples and tips
- [ ] Create `drizzle-init docs` interactive browser
- [ ] Write provider-specific documentation (all 21+ providers)
- [ ] Create getting started guide
- [ ] Add framework integration guides
- [ ] Implement troubleshooting section with common errors
- [ ] Add contextual help after each command
- [ ] Create configuration reference documentation
- [ ] Implement search within documentation
- [ ] Add links to external resources (Drizzle docs, provider docs)
- [ ] Create migration guide for users coming from other ORMs
- [ ] Add changelog/what's new viewer

## Prerequisites

None — can start immediately and improve iteratively.

## Risks & Open Questions

- **Documentation maintenance**: How to keep docs in sync with features?
- **Localization**: Support for non-English documentation?
- **Offline access**: How to handle when user has no network?
- **Terminal limitations**: Some terminals have limited rendering capabilities
- **External docs**: How to balance in-CLI docs vs official Drizzle docs?

## Notes

Documentation priority:
1. **Provider guides** - Most frequently needed
2. **Troubleshooting** - Highest user value
3. **Getting started** - First-time user experience
4. **Framework guides** - Context-specific help
5. **Configuration reference** - Power user reference

Common issues to document:
- Connection string format errors
- SSL certificate problems
- Missing environment variables
- Type mismatches between schema and database
- Migration conflicts
- Permission errors

Consider using `marked` for markdown rendering in terminal, or `ink` for rich terminal UI.

Documentation structure:
```
docs/
├── getting-started.md
├── providers/
│   ├── postgres/
│   │   ├── neon.md
│   │   ├── supabase.md
│   │   └── ...
│   ├── mysql/
│   │   └── ...
│   └── sqlite/
│       └── ...
├── frameworks/
│   ├── nextjs.md
│   ├── remix.md
│   └── ...
├── migrations/
│   └── ...
└── troubleshooting.md
```

These markdown files can be:
1. Bundled with the package
2. Rendered in CLI with formatting
3. Published as website docs
4. Kept in sync with single source of truth

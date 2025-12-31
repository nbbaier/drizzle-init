# Template Engine & Custom Templates

**Category:** New Feature
**Quarter:** Q2
**T-shirt Size:** M

## Why This Matters

The current template system is rigid: you get exactly one users table, one specific configuration. Real projects have diverse needs:

- **Different column types**: UUIDs instead of varchar IDs
- **Multiple tables**: Users, posts, comments, not just users
- **Different auth patterns**: OAuth fields, magic links, traditional passwords
- **Organization standards**: Naming conventions, audit columns, soft deletes
- **Existing schemas**: Starting from database introspection

A template engine transforms `drizzle-init` from "generate the same thing every time" to "generate exactly what you need."

## Current State

- Templates are hardcoded strings in JavaScript files
- No variables or conditional logic within templates
- Single fixed schema (users table with id, username, password, createdAt)
- No way to customize output
- No template inheritance or composition
- Templates contain typos/inconsistencies (e.g., different env var names across files)

## Proposed Future State

A powerful but approachable template system:

```
templates/
├── bases/
│   ├── postgres-base.ts.hbs
│   ├── mysql-base.ts.hbs
│   └── sqlite-base.ts.hbs
├── schemas/
│   ├── auth-basic.ts.hbs
│   ├── auth-oauth.ts.hbs
│   ├── blog-starter.ts.hbs
│   ├── ecommerce-basic.ts.hbs
│   └── empty.ts.hbs
├── connections/
│   ├── neon.ts.hbs
│   └── supabase.ts.hbs
└── configs/
    └── drizzle-config.ts.hbs
```

User experience:
```
? What schema template would you like?
  > Empty (just types, no tables)
    Basic Auth (users with email/password)
    OAuth Ready (users + accounts + sessions)
    Blog Starter (users + posts + comments)
    E-commerce (users + products + orders + categories)
```

Custom templates:
```bash
# Use local template
drizzle-init --template ./my-company-template

# Use template from URL
drizzle-init --template https://github.com/org/drizzle-templates/auth

# Use published template
drizzle-init --template @mycompany/drizzle-template-saas
```

## Key Deliverables

- [ ] Select and integrate template engine (Handlebars, EJS, or custom)
- [ ] Extract current templates to template files
- [ ] Create schema template selection prompt
- [ ] Build at least 5 schema starter templates
- [ ] Implement template variables (project name, author, etc.)
- [ ] Support local file templates via path
- [ ] Support remote templates via URL/npm
- [ ] Create template validation and preview
- [ ] Add template customization prompts (ID type, timestamps, soft delete)
- [ ] Implement template caching for remote templates
- [ ] Document template authoring guide

## Prerequisites

- **Initiative 01**: TypeScript migration for type-safe template context

## Risks & Open Questions

- **Template language choice**: Handlebars is simple but limited; EJS is more powerful but harder to read
- **Remote template security**: How to validate templates from URLs?
- **Template versioning**: How to handle templates that need updates?
- **Complexity creep**: How to keep simple case simple while enabling power users?
- **Discoverability**: How will users find available templates?

## Notes

Template variables to support:
```typescript
interface TemplateContext {
  projectName: string;
  database: 'postgresql' | 'mysql' | 'sqlite';
  provider: string;
  idType: 'serial' | 'uuid' | 'cuid' | 'nanoid';
  timestamps: boolean;
  softDelete: boolean;
  envPrefix: string;
  schemaDir: string;
  author?: string;
}
```

Consider supporting multiple template flavors:
- **Minimal**: Just the database connection, no schema
- **Basic**: Single table to get started
- **Featured**: Full starter with common patterns
- **Enterprise**: Audit logging, soft deletes, multi-tenancy

Templates in `utils/schema.js` to extract and enhance:
- PostgreSQL schema (line 3-11)
- MySQL schema (line 12-19)
- SQLite schema (line 20-26)

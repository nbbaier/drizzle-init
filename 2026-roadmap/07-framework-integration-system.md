# Framework Integration System

**Category:** Integration
**Quarter:** Q3
**T-shirt Size:** XL

## Why This Matters

Drizzle ORM doesn't exist in isolation—it lives inside Next.js apps, Remix projects, SvelteKit sites, Hono APIs. Each framework has conventions for:

- Where database code lives (`/src/db`, `/lib/db`, `/server/db`)
- How environment variables are loaded (`.env.local` vs `.env`)
- Connection pooling requirements (serverless vs long-running)
- Type generation integration

Currently, `drizzle-init` generates framework-agnostic code that users must then manually wire into their framework. This friction reduces adoption. Deep framework integration makes `drizzle-init` the obvious choice regardless of stack.

## Current State

- Generated files always go to `drizzle/` directory
- No awareness of framework conventions
- No framework-specific connection patterns
- Users must manually integrate generated code
- No adjustment for serverless vs traditional deployments
- Single template regardless of framework context

## Proposed Future State

Framework-aware initialization:

```
? What framework are you using?
  > Next.js (App Router)
    Next.js (Pages Router)
    Remix
    SvelteKit
    Nuxt
    Hono
    Express
    Fastify
    None (standalone)

? Detected: Next.js 14 with App Router
  Will configure for:
  ✓ Serverless-optimized connections
  ✓ Place files in src/db/
  ✓ Use .env.local for DATABASE_URL
  ✓ Generate server-only exports
  ✓ Add to .gitignore
```

Framework-specific outputs:

**Next.js App Router:**
```typescript
// src/db/index.ts
import 'server-only';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

**Remix:**
```typescript
// app/db.server.ts
import { drizzle } from 'drizzle-orm/...';
// Remix-specific connection pooling
```

**Hono on Cloudflare:**
```typescript
// src/db/index.ts
// Cloudflare Workers-compatible setup with bindings
```

## Key Deliverables

- [ ] Create framework detection (package.json analysis, config files)
- [ ] Build framework profiles defining conventions and patterns
- [ ] Implement Next.js integration (App Router + Pages Router)
- [ ] Implement Remix integration
- [ ] Implement SvelteKit integration
- [ ] Implement Nuxt integration
- [ ] Implement Hono/Cloudflare Workers integration
- [ ] Create Express/Fastify/standalone templates
- [ ] Add proper environment variable file handling per framework
- [ ] Generate framework-specific types and exports
- [ ] Handle serverless connection pooling patterns
- [ ] Add relevant entries to .gitignore per framework
- [ ] Create framework upgrade/migration guides

## Prerequisites

- **Initiative 01**: TypeScript architecture for framework abstractions
- **Initiative 03**: Plugin architecture (frameworks can be plugins)
- **Initiative 05**: Template engine for framework-specific templates

## Risks & Open Questions

- **Framework detection accuracy**: What if framework detection fails?
- **Version handling**: Framework APIs change. How to handle version differences?
- **Maintenance burden**: Each framework integration needs ongoing maintenance
- **Edge cases**: Monorepos, custom setups, non-standard configurations
- **Framework plugin split**: Should each framework be a separate plugin?

## Notes

Framework detection strategy:

```typescript
const frameworkDetectors = [
  { name: 'next', detect: () => hasDep('next') && hasConfig('next.config') },
  { name: 'remix', detect: () => hasDep('@remix-run/node') },
  { name: 'sveltekit', detect: () => hasDep('@sveltejs/kit') },
  { name: 'nuxt', detect: () => hasDep('nuxt') },
  { name: 'hono', detect: () => hasDep('hono') },
  { name: 'express', detect: () => hasDep('express') },
  { name: 'fastify', detect: () => hasDep('fastify') },
];
```

File placement by framework:
| Framework | DB Dir | Config | Env File |
|-----------|--------|--------|----------|
| Next.js App | `src/db/` or `app/db/` | root | `.env.local` |
| Next.js Pages | `lib/db/` | root | `.env.local` |
| Remix | `app/` | root | `.env` |
| SvelteKit | `src/lib/server/` | root | `.env` |
| Nuxt | `server/db/` | root | `.env` |
| Hono | `src/db/` | root | `.dev.vars` |
| Express | `src/db/` or `db/` | root | `.env` |

Connection patterns by deployment:
- **Serverless** (Vercel, Netlify, Cloudflare): Connection pooling, short-lived connections
- **Edge** (Cloudflare Workers, Vercel Edge): HTTP-based drivers only
- **Traditional** (VPS, containers): Persistent connection pools

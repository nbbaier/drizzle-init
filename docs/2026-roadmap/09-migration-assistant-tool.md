# Migration Assistant Tool

**Category:** New Feature
**Quarter:** Q3
**T-shirt Size:** L

## Why This Matters

Schema initialization is just the beginning. The real complexity in database-backed applications is managing schema changes over time. Developers new to Drizzle (or ORMs in general) struggle with:

- When to generate vs push vs migrate
- How to handle data migrations alongside schema changes
- Recovering from failed migrations
- Understanding what changes drizzle-kit detected
- Safely deploying migrations in production

A migration assistant extends `drizzle-init` beyond scaffolding into ongoing project companion, reducing the learning curve and preventing costly mistakes.

## Current State

- `drizzle-init` only handles initial setup
- No help with ongoing schema management
- Users must learn drizzle-kit commands separately
- No guidance on migration best practices
- No tooling for common migration tasks
- npm scripts added but no usage guidance

## Proposed Future State

An intelligent migration companion:

```bash
$ drizzle-init migrate

? What would you like to do?
  > Review pending changes
    Generate migration
    Apply migrations (push)
    Rollback last migration
    Migration history
    Seed database
    Reset database (⚠️ destructive)
```

Change review:
```
$ drizzle-init migrate review

Comparing schema to database...

┌─────────────────────────────────────────────────────────────┐
│  PENDING CHANGES                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  + CREATE TABLE "posts"                                     │
│    ├─ id: serial PRIMARY KEY                                │
│    ├─ title: varchar(255) NOT NULL                          │
│    ├─ content: text                                         │
│    ├─ authorId: integer REFERENCES users(id)                │
│    └─ createdAt: timestamp DEFAULT NOW()                    │
│                                                             │
│  ~ ALTER TABLE "users"                                      │
│    ├─ + ADD COLUMN bio text                                 │
│    └─ ~ MODIFY email: add UNIQUE constraint                 │
│                                                             │
│  ⚠️ WARNINGS:                                               │
│  └─ Adding UNIQUE to "email" may fail if duplicates exist   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

? How would you like to proceed?
  > Generate migration file
    Push directly (development)
    Cancel
```

Migration safety checks:
```
$ drizzle-init migrate push

⚠️ Destructive changes detected:

  - DROP COLUMN users.legacyField

This will permanently delete data. Consider:
1. Create a backup first
2. Migrate data to new columns before dropping

? Continue anyway? (y/N)
```

## Key Deliverables

- [ ] Create `drizzle-init migrate` command suite
- [ ] Implement schema diff visualization
- [ ] Build interactive migration wizard
- [ ] Add destructive change detection and warnings
- [ ] Create migration rollback functionality
- [ ] Implement migration history viewer
- [ ] Add database seeding integration
- [ ] Create backup reminders for destructive changes
- [ ] Build migration dry-run mode
- [ ] Add CI-friendly migration commands
- [ ] Implement migration file editing assistance
- [ ] Create migration troubleshooting guides

## Prerequisites

- **Initiative 01**: TypeScript architecture for CLI commands
- **Initiative 08**: Connection validation for database connectivity

## Risks & Open Questions

- **drizzle-kit overlap**: How to complement, not conflict with, drizzle-kit?
- **Rollback complexity**: Drizzle doesn't auto-generate down migrations. How to handle?
- **Production safety**: How to prevent accidental destructive operations?
- **Database state**: How to handle cases where DB is out of sync with migrations?
- **Multi-environment**: How to manage migrations across dev/staging/production?

## Notes

Migration workflow states:
```
Schema Change → Generate → Review → Apply → Verify
                   ↓
             Edit if needed
```

Commands to wrap/enhance from drizzle-kit:
- `drizzle-kit generate` → `drizzle-init migrate generate`
- `drizzle-kit push` → `drizzle-init migrate push`
- `drizzle-kit migrate` → `drizzle-init migrate apply`
- `drizzle-kit introspect` → `drizzle-init migrate pull`

Safety levels:
1. **Development**: Allow push, less warnings
2. **Staging**: Require migration files, warnings
3. **Production**: Require migration files, strict warnings, backup prompts

Seeding integration:
```typescript
// drizzle/seed.ts
import { db } from './db';
import { users, posts } from './schema';

export async function seed() {
  await db.insert(users).values([
    { email: 'admin@example.com', name: 'Admin' }
  ]);
  console.log('Database seeded!');
}
```

```bash
$ drizzle-init migrate seed
Running seed file...
✓ Inserted 1 user
Database seeded successfully!
```

Consider integration with database backup tools for pre-migration snapshots.

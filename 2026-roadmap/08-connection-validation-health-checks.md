# Connection Validation & Health Checks

**Category:** DX Improvement
**Quarter:** Q2
**T-shirt Size:** S

## Why This Matters

The most frustrating moment in developer experience is when everything *looks* right but nothing works. Currently, `drizzle-init` generates configuration files with placeholder values and hopes users fill them in correctly. There's no feedback until users run their code and hit cryptic connection errors.

Proactive validation transforms this experience. Instead of "here are your files, good luck," the CLI becomes a helpful partner: "Let me verify your database connection works before we continue."

## Current State

- No validation of database connection strings
- No verification that generated configuration is correct
- Placeholder values like `PASTE_YOUR_DATABASE_URL_HERE` in templates
- Users discover configuration errors only at runtime
- No guidance on correct connection string format
- No testing of credentials before file generation

## Proposed Future State

A validation-first initialization experience:

```
? Enter your DATABASE_URL:
  > postgres://user:password@host.neon.tech/dbname

  ⠋ Validating connection...
  ✓ Connection successful!

  Database info:
  ├─ Type: PostgreSQL 15.4
  ├─ Host: host.neon.tech
  ├─ Database: dbname
  ├─ SSL: Enabled
  └─ Latency: 45ms

  ? Save to .env file? (Y/n)
```

Connection string validation:
```
? Enter your DATABASE_URL:
  > postgres://user@host/db

  ✗ Invalid connection string
  └─ Missing password. Format: postgres://user:password@host/database

  💡 For Neon, copy the connection string from:
     Dashboard → Connection Details → Connection String
```

Health check command:
```bash
$ drizzle-init doctor

Checking drizzle configuration...

  ✓ drizzle.config.ts exists
  ✓ Config syntax valid
  ✓ Schema file exists
  ✓ DATABASE_URL environment variable set
  ⠋ Testing database connection...
  ✓ Database connection successful
  ✓ drizzle-kit installed
  ✓ Schema matches database (no pending changes)

All checks passed! Your Drizzle setup is healthy.
```

## Key Deliverables

- [ ] Create connection string parser and validator
- [ ] Implement provider-specific connection testing
- [ ] Add interactive environment variable input with validation
- [ ] Build `drizzle-init doctor` health check command
- [ ] Create connection string format helpers per provider
- [ ] Implement secure credential handling (don't log passwords)
- [ ] Add SSL/TLS verification
- [ ] Generate proper .env file with validated credentials
- [ ] Create provider-specific troubleshooting tips
- [ ] Add network connectivity checks
- [ ] Implement retry logic for transient failures
- [ ] Support connection testing in CI (non-interactive mode)

## Prerequisites

- **Initiative 04**: Dependency installation (need database drivers to test connections)

## Risks & Open Questions

- **Security**: How to handle credentials securely during validation?
- **Network requirements**: What if user is offline or behind firewall?
- **Provider differences**: Each provider has unique connection requirements
- **Timeout handling**: How long to wait for connection before failing?
- **CI/CD usage**: How to skip interactive validation in automated environments?

## Notes

Connection string formats by provider:

**PostgreSQL:**
```
# Neon
postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Supabase
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Vercel Postgres
postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb
```

**MySQL:**
```
# PlanetScale
mysql://user:password@aws.connect.psdb.cloud/dbname?ssl={"rejectUnauthorized":true}

# TiDB Serverless
mysql://user:password@gateway.tidbcloud.com:4000/dbname
```

**SQLite:**
```
# Turso
libsql://db-name-user.turso.io?authToken=xxx

# Local
file:./dev.db
```

Validation steps:
1. Parse connection string format
2. Validate required components present
3. DNS resolution check (can we reach the host?)
4. TCP connection check (is the port open?)
5. Authentication check (are credentials valid?)
6. Database existence check (does the database exist?)
7. Permission check (can we query?)

Consider using `pg`, `mysql2`, `better-sqlite3` for actual connection testing.

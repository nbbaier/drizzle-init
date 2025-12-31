# Interactive Schema Builder

**Category:** New Feature
**Quarter:** Q2
**T-shirt Size:** L

## Why This Matters

The default generated schema is a simple users table. But every project is different, and most developers know their data model when starting. Forcing users to manually edit the generated schema after initialization defeats the purpose of a scaffolding tool.

An interactive schema builder transforms `drizzle-init` into a true project bootstrapping experience. Users can define their actual schema upfront, getting production-ready code from minute one instead of a placeholder they'll immediately replace.

## Current State

- Fixed users table schema with 4 columns
- No way to customize tables or columns during init
- Users must manually edit generated files
- No relationship definition support
- No validation or constraint options
- No index generation

## Proposed Future State

An interactive TUI (Terminal User Interface) for building schemas:

```
? Would you like to define your schema interactively? (Y/n)

┌─────────────────────────────────────────────────────────────┐
│  DRIZZLE SCHEMA BUILDER                            [?] Help │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tables:                                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐    │
│  │   users     │───▶│   posts     │───▶│   comments   │    │
│  │  ─────────  │    │  ─────────  │    │  ──────────  │    │
│  │  id (pk)    │    │  id (pk)    │    │  id (pk)     │    │
│  │  email      │    │  title      │    │  content     │    │
│  │  name       │    │  authorId   │    │  postId      │    │
│  │  createdAt  │    │  createdAt  │    │  authorId    │    │
│  └─────────────┘    └─────────────┘    └──────────────┘    │
│                                                             │
│  [a] Add Table  [e] Edit Table  [d] Delete Table           │
│  [r] Add Relation  [g] Generate  [q] Quit                  │
└─────────────────────────────────────────────────────────────┘
```

Column builder:
```
? Adding column to 'users' table

? Column name: email
? Column type: (Use arrow keys)
  > varchar
    text
    integer
    boolean
    timestamp
    uuid
    json

? Length (for varchar): 255
? Constraints: (Select with space)
  > [x] Not Null
    [x] Unique
    [ ] Primary Key
    [ ] Default value
```

## Key Deliverables

- [ ] Design TUI interface using Ink or blessed
- [ ] Implement table creation wizard
- [ ] Create column type selector with database-specific types
- [ ] Add constraint configuration (unique, not null, default, check)
- [ ] Implement relationship builder (one-to-one, one-to-many, many-to-many)
- [ ] Generate proper TypeScript schema from TUI input
- [ ] Add index creation wizard
- [ ] Implement enum/type definition support
- [ ] Create schema preview before generation
- [ ] Add "import from SQL" option for existing schemas
- [ ] Save/load schema builder sessions
- [ ] Support composite primary keys and unique constraints

## Prerequisites

- **Initiative 01**: TypeScript for type-safe schema representation
- **Initiative 05**: Template engine for flexible code generation

## Risks & Open Questions

- **TUI complexity**: Terminal UIs are hard to get right. Alternative: wizard-style prompts?
- **Column type mapping**: Different databases have different types. How to abstract?
- **Relationship complexity**: Many-to-many requires junction tables. How to make this intuitive?
- **Schema size limits**: What if someone tries to create 50 tables interactively?
- **Mobile/limited terminals**: Not all terminals support advanced TUI features

## Notes

Column types to support per database:

**PostgreSQL:**
- `serial`, `bigserial` (auto-increment)
- `varchar(n)`, `text`, `char(n)`
- `integer`, `bigint`, `smallint`, `decimal`, `real`, `double precision`
- `boolean`
- `timestamp`, `timestamptz`, `date`, `time`
- `uuid`
- `json`, `jsonb`
- `array`

**MySQL:**
- `int`, `bigint`, `tinyint`, `decimal`, `float`, `double`
- `varchar(n)`, `text`, `char(n)`
- `boolean` (tinyint)
- `datetime`, `timestamp`, `date`, `time`
- `json`
- `enum`, `set`

**SQLite:**
- `integer`, `real`
- `text`
- `blob`

Consider storing schema builder output as intermediate JSON:
```json
{
  "tables": [
    {
      "name": "users",
      "columns": [
        {"name": "id", "type": "serial", "primaryKey": true},
        {"name": "email", "type": "varchar", "length": 255, "unique": true}
      ],
      "indexes": []
    }
  ],
  "relations": []
}
```

This JSON can then be:
1. Transformed to Drizzle schema code
2. Saved for later editing
3. Version controlled
4. Imported/exported

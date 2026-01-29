import { describe, expect, test } from "bun:test";
import { schemaContent } from "./schema";

describe("schemaContent", () => {
  test("generates PostgreSQL schema", () => {
    const result = schemaContent("PostgreSQL", "Neon");
    expect(result).toMatchSnapshot();
    expect(result).toContain("pgTable");
    expect(result).toContain("drizzle-orm/pg-core");
  });

  test("generates MySQL schema", () => {
    const result = schemaContent("MySQL", "planetScale");
    expect(result).toMatchSnapshot();
    expect(result).toContain("mysqlTable");
    expect(result).toContain("drizzle-orm/mysql-core");
  });

  test("generates SQLite schema", () => {
    const result = schemaContent("SQLite", "Turso");
    expect(result).toMatchSnapshot();
    expect(result).toContain("sqliteTable");
    expect(result).toContain("drizzle-orm/sqlite-core");
  });

  test("returns empty string for unknown database", () => {
    const result = schemaContent("Unknown", "Provider");
    expect(result).toBe("");
  });

  test("provider parameter doesn't affect schema output", () => {
    const result1 = schemaContent("PostgreSQL", "Neon");
    const result2 = schemaContent("PostgreSQL", "Supabase");
    expect(result1).toBe(result2);
  });
});

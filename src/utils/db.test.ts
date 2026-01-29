import { describe, expect, test } from "bun:test";
import { dbContent } from "./db";

describe("dbContent", () => {
  describe("PostgreSQL providers", () => {
    test("generates template for Neon", () => {
      const result = dbContent("PostgreSQL", "Neon");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Xata", () => {
      const result = dbContent("PostgreSQL", "Xata");
      expect(result).toMatchSnapshot();
    });

    test("generates template for PostgresJS", () => {
      const result = dbContent("PostgreSQL", "PostgresJS");
      expect(result).toMatchSnapshot();
    });

    test("generates template for node-postgres", () => {
      const result = dbContent("PostgreSQL", "node-postgres");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Cloudflare", () => {
      const result = dbContent("PostgreSQL", "Cloudflare");
      expect(result).toMatchSnapshot();
      // Ensure template doesn't contain invalid spread operator
      expect(result).not.toContain(".from(...)");
      expect(result).toContain(".from(/* your_table */)");
    });

    test("generates template for PGlite", () => {
      const result = dbContent("PostgreSQL", "PGlite");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Vercel Postgres", () => {
      const result = dbContent("PostgreSQL", "Vercel Postgres");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Supabase", () => {
      const result = dbContent("PostgreSQL", "Supabase");
      expect(result).toMatchSnapshot();
    });

    test("generates template for AWS Data API", () => {
      const result = dbContent("PostgreSQL", "AWS Data API");
      expect(result).toMatchSnapshot();
    });

    test("generates template for HTTP Proxy", () => {
      const result = dbContent("PostgreSQL", "HTTP Proxy");
      expect(result).toMatchSnapshot();
    });
  });

  describe("MySQL providers", () => {
    test("generates template for planetScale", () => {
      const result = dbContent("MySQL", "planetScale");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Mysql2", () => {
      const result = dbContent("MySQL", "Mysql2");
      expect(result).toMatchSnapshot();
    });

    test("generates template for HTTP Proxy", () => {
      const result = dbContent("MySQL", "HTTP Proxy");
      expect(result).toMatchSnapshot();
    });

    test("generates template for TiDB Serverless", () => {
      const result = dbContent("MySQL", "TiDB Serverless");
      expect(result).toMatchSnapshot();
    });
  });

  describe("SQLite providers", () => {
    test("generates template for Turso", () => {
      const result = dbContent("SQLite", "Turso");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Cloudflare D1", () => {
      const result = dbContent("SQLite", "Cloudflare D1");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Bun sqlite", () => {
      const result = dbContent("SQLite", "Bun sqlite");
      expect(result).toMatchSnapshot();
    });

    test("generates template for React Native SQLite", () => {
      const result = dbContent("SQLite", "React Native SQLite");
      expect(result).toMatchSnapshot();
    });

    test("generates template for Expo SQLite", () => {
      const result = dbContent("SQLite", "Expo SQLite");
      expect(result).toMatchSnapshot();
    });

    test("generates template for better-sqlite3", () => {
      const result = dbContent("SQLite", "better-sqlite3");
      expect(result).toMatchSnapshot();
    });

    test("generates template for HTTP Proxy", () => {
      const result = dbContent("SQLite", "HTTP Proxy");
      expect(result).toMatchSnapshot();
    });
  });

  describe("edge cases", () => {
    test("returns empty string for unknown database", () => {
      const result = dbContent("Unknown", "Provider");
      expect(result).toBe("");
    });

    test("returns empty string for unknown PostgreSQL provider", () => {
      const result = dbContent("PostgreSQL", "UnknownProvider");
      expect(result).toBe("");
    });
  });
});

import { describe, expect, test } from "bun:test";
import { drizzleConfig } from "./drizzle-config";

describe("drizzleConfig", () => {
  describe("PostgreSQL providers", () => {
    test("generates standard PostgreSQL config", () => {
      const result = drizzleConfig("PostgreSQL", "Neon");
      expect(result).toMatchSnapshot();
      expect(result).toContain('dialect:"postgresql"');
      expect(result).toContain("Configured for PostgreSQL with Neon");
    });

    test("generates AWS Data API config with special credentials", () => {
      const result = drizzleConfig("PostgreSQL", "AWS Data API");
      expect(result).toMatchSnapshot();
      expect(result).toContain('driver:"aws-data-api"');
      expect(result).toContain("resourceArn");
      expect(result).toContain("secretArn");
    });

    test("generates config for other PostgreSQL providers", () => {
      const providers = ["Xata", "PostgresJS", "Supabase", "Vercel Postgres"];
      for (const provider of providers) {
        const result = drizzleConfig("PostgreSQL", provider);
        expect(result).toContain('dialect:"postgresql"');
        expect(result).toContain(`Configured for PostgreSQL with ${provider}`);
      }
    });
  });

  describe("MySQL providers", () => {
    test("generates MySQL config", () => {
      const result = drizzleConfig("MySQL", "planetScale");
      expect(result).toMatchSnapshot();
      expect(result).toContain('dialect:"mysql"');
      expect(result).toContain("Configured for MySQL with planetScale");
    });

    test("generates config for all MySQL providers", () => {
      const providers = [
        "planetScale",
        "Mysql2",
        "HTTP Proxy",
        "TiDB Serverless",
      ];
      for (const provider of providers) {
        const result = drizzleConfig("MySQL", provider);
        expect(result).toContain('dialect:"mysql"');
        expect(result).toContain(`Configured for MySQL with ${provider}`);
      }
    });
  });

  describe("SQLite providers", () => {
    test("generates standard SQLite config", () => {
      const result = drizzleConfig("SQLite", "better-sqlite3");
      expect(result).toMatchSnapshot();
      expect(result).toContain('dialect:"sqlite"');
    });

    test("generates Turso config with authToken", () => {
      const result = drizzleConfig("SQLite", "Turso");
      expect(result).toMatchSnapshot();
      expect(result).toContain('driver: "turso"');
      expect(result).toContain("authToken");
      expect(result).toContain("Configured for SQLite with Turso");
    });

    test("generates Cloudflare D1 config with special credentials", () => {
      const result = drizzleConfig("SQLite", "Cloudflare D1");
      expect(result).toMatchSnapshot();
      expect(result).toContain('driver: "d1-http"');
      expect(result).toContain("accountId");
      expect(result).toContain("databaseId");
      expect(result).toContain("Configured for SQLite with Cloudflare D1");
    });

    test("generates Expo SQLite config without url credentials", () => {
      const result = drizzleConfig("SQLite", "Expo SQLite");
      expect(result).toMatchSnapshot();
      expect(result).toContain('driver: "expo"');
      expect(result).not.toContain("dbCredentials");
      expect(result).toContain("Configured for SQLite with Expo SQLite");
    });
  });

  describe("edge cases", () => {
    test("returns empty string for unknown database", () => {
      const result = drizzleConfig("Unknown", "Provider");
      expect(result).toBe("");
    });
  });
});

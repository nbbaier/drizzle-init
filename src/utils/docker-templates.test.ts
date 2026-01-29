import { describe, expect, test } from "bun:test";
import { generateDockerCompose } from "./docker-templates";

describe("generateDockerCompose", () => {
  test("generates PostgreSQL docker-compose", () => {
    const result = generateDockerCompose("PostgreSQL");
    expect(result).toMatchSnapshot();
    expect(result).toContain("postgres:alpine");
    expect(result).toContain("5432:5432");
    expect(result).toContain("POSTGRES_USER");
    expect(result).toContain("pgdata");
  });

  test("generates MySQL docker-compose", () => {
    const result = generateDockerCompose("MySQL");
    expect(result).toMatchSnapshot();
    expect(result).toContain("mysql:8");
    expect(result).toContain("3306:3306");
    expect(result).toContain("MYSQL_ROOT_PASSWORD");
    expect(result).toContain("mysqldata");
  });

  test("returns null for SQLite (no docker needed)", () => {
    const result = generateDockerCompose("SQLite");
    expect(result).toBeNull();
  });

  test("returns null for unknown database", () => {
    const result = generateDockerCompose("Unknown");
    expect(result).toBeNull();
  });
});

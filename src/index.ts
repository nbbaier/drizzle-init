import fs from "node:fs";
import { ExitPromptError } from "@inquirer/core";
import chalk from "chalk";
import { program } from "commander";
import { dbContent } from "./utils/db";
import { generateDockerCompose } from "./utils/docker-templates";
import { drizzleConfig } from "./utils/drizzle-config";
import { createEnvFile, updateGitignore } from "./utils/env-manager";
import { safeWriteFile } from "./utils/file-system";
import { installDependencies } from "./utils/package-manager";
import { promptConfirm, promptList } from "./utils/prompts";
import { schemaContent } from "./utils/schema";
import { tagline } from "./utils/tagline";
import { updateScripts } from "./utils/update-scripts";

const providerChoicesByDb: Record<string, readonly string[]> = {
  PostgreSQL: [
    "Neon",
    "Xata",
    "PostgresJS",
    "PGlite",
    "node-postgres",
    "Cloudflare",
    "Vercel Postgres",
    "Supabase",
    "AWS Data API",
    "HTTP Proxy",
    "exit...",
  ],
  SQLite: [
    "Turso",
    "Cloudflare D1",
    "Bun sqlite",
    "React Native SQLite",
    "Expo SQLite",
    "better-sqlite3",
    "HTTP Proxy",
    "exit...",
  ],
  MySQL: ["planetScale", "Mysql2", "HTTP proxy", "TiDB Serverless"],
};

const promptProviderChoice = async (
  dbChoice: string
): Promise<string | null> => {
  const choices = providerChoicesByDb[dbChoice];
  if (!choices) {
    return null;
  }

  const providerChoice = await promptList("What are you using?", [...choices]);
  if (providerChoice === "exit...") {
    process.exit(0);
  }

  return providerChoice;
};

const logIfWritten = (filepath: string, written: boolean): void => {
  if (!written) {
    return;
  }

  console.log(`${chalk.green(filepath)} was created successfully.`);
};

const runInit = async (): Promise<void> => {
  const dbChoice = await promptList("Choose your database?", [
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "Exit...",
  ]);

  if (dbChoice === "Exit...") {
    process.exit(0);
  }

  const providerChoice = await promptProviderChoice(dbChoice);
  if (!providerChoice) {
    console.log("no option selected");
    return;
  }

  const addScripts = await promptConfirm(
    "Do you want to add drizzle-kit scripts into packageon for easier access?"
  );
  if (addScripts) {
    await updateScripts();
  }

  fs.mkdirSync("drizzle/migrations", { recursive: true });

  const schemaWritten = await safeWriteFile(
    "drizzle/schema.ts",
    schemaContent(dbChoice, providerChoice)
  );
  logIfWritten("schema.ts", schemaWritten);

  const dbWritten = await safeWriteFile(
    "drizzle/db.ts",
    dbContent(dbChoice, providerChoice)
  );
  logIfWritten("db.ts", dbWritten);

  const configWritten = await safeWriteFile(
    "drizzle.config.ts",
    drizzleConfig(dbChoice, providerChoice)
  );
  if (configWritten) {
    console.log(
      chalk.green("drizzle.config.ts has been created successfully.")
    );
  }

  await createEnvFile(providerChoice);
  await updateGitignore();

  const dockerContent = generateDockerCompose(dbChoice);
  if (dockerContent) {
    const generateDocker = await promptConfirm(
      "Do you want to generate a docker-compose.yml file?",
      true
    );
    if (generateDocker) {
      await safeWriteFile("docker-compose.yml", dockerContent);
      console.log(chalk.green("docker-compose.yml created successfully."));
    }
  }

  await installDependencies(dbChoice, providerChoice);
};

export function runCLI(): void {
  tagline("drizzle-init");

  try {
    program.action(async () => {
      await runInit();
    });

    program.parse(process.argv);
  } catch (error) {
    if (error instanceof ExitPromptError) {
      console.log(chalk.blue("\nThank you for using drizzle-init CLI!"));
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

process.on("SIGINT", () => {
  console.log(chalk.blue("\nThank you for using drizzle-init CLI!"));
  process.exit();
});

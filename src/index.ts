import chalk from "chalk";
import { program } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import { dbContent } from "./utils/db.js";
import { drizzleConfig } from "./utils/drizzleConfig.js";
import { schemaContent } from "./utils/schema.js";
import { tagline } from "./utils/tagline.js";
import { updateScripts } from "./utils/updateScripts.js";
import { safeWriteFile } from "./utils/fileSystem.js";
import { createEnvFile, updateGitignore } from "./utils/envManager.js";
import { installDependencies } from "./utils/packageManager.js";
import { generateDockerCompose } from "./utils/dockerTemplates.js";
import { promptList, promptConfirm } from "./utils/prompts.js";

export async function runCLI(): Promise<void> {
  tagline("drizzle-init");

  try {
    program.action(async () => {
      const dbChoice = await promptList(
        "Choose your database?",
        ["PostgreSQL", "MySQL", "SQLite", "Exit..."]
      );

      let providerChoice: string;

      switch (dbChoice) {
        case "PostgreSQL":
          providerChoice = await promptList("What are you using?", [
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
          ]);
          if (providerChoice === "exit...") process.exit(0);
          break;

        case "SQLite":
          providerChoice = await promptList("What are you using?", [
            "Turso",
            "Cloudflare D1",
            "Bun sqlite",
            "React Native SQLite",
            "Expo SQLite",
            "better-sqlite3",
            "HTTP Proxy",
            "exit...",
          ]);
          if (providerChoice === "exit...") process.exit(0);
          break;

        case "MySQL":
          providerChoice = await promptList("What are you using?", [
            "planetScale",
            "Mysql2",
            "HTTP proxy",
            "TiDB Serverless",
          ]);
          if (providerChoice === "exit...") process.exit(0);
          break;

        case "Exit...":
          process.exit(0);
          break;

        default:
          console.log("no option selected");
          return;
      }

      const addScripts = await promptConfirm(
        "Do you want to add drizzle-kit scripts into package.json for easier access?"
      );
      if (addScripts) updateScripts();

      // Create directories (ensure they exist)
      fs.mkdirSync("drizzle/migrations", { recursive: true });

      const schemaWritten = await safeWriteFile(
        "drizzle/schema.ts",
        schemaContent(dbChoice, providerChoice!)
      );
      if (schemaWritten) console.log(`${chalk.green("schema.ts")} was created successfully.`);

      const dbWritten = await safeWriteFile(
        "drizzle/db.ts",
        dbContent(dbChoice, providerChoice!)
      );
      if (dbWritten) console.log(`${chalk.green("db.ts")} was created successfully.`);

      const configWritten = await safeWriteFile(
        "drizzle.config.ts",
        drizzleConfig(dbChoice, providerChoice!)
      );
      if (configWritten) console.log(chalk.green("drizzle.config.ts has been created successfully."));

      await createEnvFile(providerChoice!);
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

      await installDependencies(dbChoice, providerChoice!);
    });

    program.parse(process.argv);
  } catch (error) {
    if (error instanceof (inquirer as any).errors.ExitPromptError) {
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

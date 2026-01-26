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

let PROVIDER, DATABASE, SCRIPTS, ENV, VERSION, DESCRIPTION;

export async function runCLI() {
  tagline("drizzle-init");
  // getVersion().then(r=>{program.version(r.version).description(r.desc);}).catch(console.error);

  try {
    program.action(async () => {
      DATABASE = await inquirer.prompt([
        {
          type: "list",
          name: "choose",
          message: "Choose your database?",
          choices: ["PostgreSQL", "MySQL", "SQLite", "Exit..."],
        },
      ]);
      switch (DATABASE.choose) {
        case "PostgreSQL":
          PROVIDER = await inquirer.prompt([
            {
              type: "list",
              name: "choose",
              message: "What are you using?",
              choices: [
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
            },
          ]);
          if (PROVIDER.choose === "exit...") process.exit(0);

          break;

        case "SQLite":
          PROVIDER = await inquirer.prompt([
            {
              type: "list",
              name: "choose",
              message: "What are you using?",
              choices: [
                "Turso",
                "Cloudflare D1",
                "Bun sqlite",
                "React Native SQLite",
                "Expo SQLite",
                "better-sqlite3",
                "HTTP Proxy",
                "exit...",
              ],
            },
          ]);
          if (PROVIDER.choose === "exit...") process.exit(0);

          break;
        case "MySQL":
          PROVIDER = await inquirer.prompt([
            {
              type: "list",
              name: "choose",
              message: "What are you using?",
              choices: [
                "planetScale",
                "Mysql2",
                "HTTP proxy",
                "TiDB Serverless",
              ],
            },
          ]);
          if (PROVIDER.choose === "exit...") process.exit(0);

          break;
        case "Exit...":
          process.exit(0);
          break;
        default:
          console.log("no option selected");
          break;
      }
      SCRIPTS = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message:
            "Do you want to add drizzle-kit scripts into package.json for easier access?",
        },
      ]);
      if (SCRIPTS.confirm) updateScripts();

      // Create directories (ensure they exist)
      fs.mkdirSync("drizzle/migrations", { recursive: true });
      // console.log(`Directory 'drizzle' and 'migrations' checked/created.`);

      const schemaWritten = await safeWriteFile(
        "drizzle/schema.ts",
        schemaContent(DATABASE.choose, PROVIDER.choose)
      );
      if (schemaWritten) console.log(`${chalk.green("schema.ts")} was created successfully.`);

      const dbWritten = await safeWriteFile(
        "drizzle/db.ts",
        dbContent(DATABASE.choose, PROVIDER.choose)
      );
      if (dbWritten) console.log(`${chalk.green("db.ts")} was created successfully.`);

      const configWritten = await safeWriteFile(
        "drizzle.config.ts",
        drizzleConfig(DATABASE.choose, PROVIDER.choose)
      );
      if (configWritten) console.log(chalk.green("drizzle.config.ts has been created successfully."));

      await createEnvFile(PROVIDER.choose);
      await updateGitignore();

      const dockerContent = generateDockerCompose(DATABASE.choose);
      if (dockerContent) {
        const dockerAnswer = await inquirer.prompt([
          {
            type: "confirm",
            name: "generate",
            message: "Do you want to generate a docker-compose.yml file?",
            default: true,
          },
        ]);
        if (dockerAnswer.generate) {
          await safeWriteFile("docker-compose.yml", dockerContent);
          console.log(chalk.green("docker-compose.yml created successfully."));
        }
      }

      await installDependencies(DATABASE.choose, PROVIDER.choose);
    });

    program.parse(process.argv);
  } catch (error) {
    if (error instanceof inquirer.errors.ExitPromptError) {
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

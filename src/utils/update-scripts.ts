import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const ensureScripts = (value: unknown): Record<string, string> => {
  if (!isRecord(value)) {
    return {};
  }

  const scripts: Record<string, string> = {};
  for (const [key, scriptValue] of Object.entries(value)) {
    if (typeof scriptValue === "string") {
      scripts[key] = scriptValue;
    }
  }

  return scripts;
};

export const updateScripts = async (): Promise<void> => {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  let data: string;
  try {
    data = await readFile(packageJsonPath, "utf8");
  } catch (error: unknown) {
    console.log(
      chalk.red(
        "It looks like the package.json file is missing in the current directory."
      )
    );
    console.log(
      chalk.green(
        "To create a new package.json file, you can use the following command:"
      )
    );
    console.log(chalk.green("npm init"));
    console.error(`Error reading package.json: ${String(error)}`);
    return;
  }

  let packageJson: unknown;
  try {
    packageJson = JSON.parse(data);
  } catch (error: unknown) {
    console.error(`Error parsing package.json: ${String(error)}`);
    return;
  }

  if (!isRecord(packageJson)) {
    console.error("Error parsing package.json: expected a JSON object");
    return;
  }

  const scripts = ensureScripts(packageJson.scripts);

  scripts["db:pull"] = "drizzle-kit introspect";
  scripts["db:push"] = "drizzle-kit push";
  scripts["db:migrate"] = "drizzle-kit migrate";
  scripts["db:generate"] = "drizzle-kit generate";
  scripts["db:drop"] = "drizzle-kit drop";
  scripts["db:up"] = "drizzle-kit up";
  scripts["db:check"] = "drizzle-kit check";
  scripts["db:studio"] = "drizzle-kit studio";

  packageJson.scripts = scripts;

  const updatedPackageJson = JSON.stringify(packageJson, null, 2);

  try {
    await writeFile(packageJsonPath, updatedPackageJson, "utf8");
  } catch (error: unknown) {
    console.error(`Error writing package.json: ${String(error)}`);
    return;
  }

  console.log(
    chalk.green(
      "Success! Your package.json file has been updated with the following scripts:"
    )
  );
  console.log(chalk.blue("db:pull - Introspects the database schema."));
  console.log(
    chalk.blue("db:push - Pushes the latest changes to the database.")
  );
  console.log(
    chalk.blue("db:migrate - Applies pending migrations to the database.")
  );
  console.log(
    chalk.blue(
      "db:generate - Generates code based on the current database schema."
    )
  );
  console.log(chalk.blue("db:drop - Drops the entire database schema."));
  console.log(
    chalk.blue("db:up - Brings up the database to the latest version.")
  );
  console.log(
    chalk.blue(
      "db:check - Checks the current database schema against the code."
    )
  );
  console.log(
    chalk.blue(
      "db:studio - Opens a database management studio for visual interaction."
    )
  );
};

import { spawn } from "node:child_process";
import fs from "node:fs";
import chalk from "chalk";
import { promptConfirm } from "./prompts.js";

const runCommand = (command: string, args: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: true });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
        return;
      }

      resolve();
    });
    child.on("error", (err) => {
      reject(err);
    });
  });
};

export const detectPackageManager = (): string => {
  if (fs.existsSync("yarn.lock")) {
    return "yarn";
  }
  if (fs.existsSync("pnpm-lock.yaml")) {
    return "pnpm";
  }
  if (fs.existsSync("bun.lockb")) {
    return "bun";
  }
  return "npm";
};

interface DependencySet {
  deps: string[];
  devDeps: string[];
}
interface ProviderRule {
  providers: readonly string[];
  deps?: readonly string[];
  devDeps?: readonly string[];
}

const providerRulesByDb: Record<string, readonly ProviderRule[]> = {
  PostgreSQL: [
    { providers: ["Neon"], deps: ["@neondatabase/serverless"] },
    { providers: ["Xata"], deps: ["@xata.io/client"] },
    { providers: ["PostgresJS", "Supabase"], deps: ["postgres"] },
    {
      providers: ["node-postgres", "Cloudflare"],
      deps: ["pg"],
      devDeps: ["@types/pg"],
    },
    { providers: ["PGlite"], deps: ["@electric-sql/pglite"] },
    { providers: ["Vercel Postgres"], deps: ["@vercel/postgres"] },
    {
      providers: ["AWS Data API"],
      deps: ["@aws-sdk/client-rds-data", "@aws-sdk/credential-providers"],
    },
    { providers: ["HTTP Proxy"], deps: ["axios"] },
  ],
  MySQL: [
    { providers: ["planetScale"], deps: ["@planetscale/database"] },
    { providers: ["Mysql2"], deps: ["mysql2"] },
    { providers: ["TiDB Serverless"], deps: ["@tidbcloud/serverless"] },
    { providers: ["HTTP Proxy"], deps: ["axios"] },
  ],
  SQLite: [
    { providers: ["Turso"], deps: ["@libsql/client"] },
    {
      providers: ["React Native SQLite", "Expo SQLite"],
      deps: ["expo-sqlite"],
    },
    { providers: ["better-sqlite3"], deps: ["better-sqlite3"] },
    { providers: ["HTTP Proxy"], deps: ["axios"] },
  ],
};

const applyProviderRules = (
  target: DependencySet,
  provider: string,
  rules: readonly ProviderRule[]
): void => {
  for (const rule of rules) {
    if (!rule.providers.includes(provider)) {
      continue;
    }

    if (rule.deps) {
      target.deps.push(...rule.deps);
    }
    if (rule.devDeps) {
      target.devDeps.push(...rule.devDeps);
    }
  }
};

const getDependencies = (db: string, provider: string): DependencySet => {
  const target: DependencySet = {
    deps: ["drizzle-orm"],
    devDeps: ["drizzle-kit"],
  };
  const rules = providerRulesByDb[db];
  if (rules) {
    applyProviderRules(target, provider, rules);
  }
  return target;
};

const devFlagByPm: Record<string, string> = {
  npm: "--save-dev",
  bun: "-d",
  pnpm: "-D",
  yarn: "-D",
};

export const installDependencies = async (
  db: string,
  provider: string
): Promise<void> => {
  const { deps, devDeps } = getDependencies(db, provider);
  const pm = detectPackageManager();

  console.log(chalk.blue(`Detected package manager: ${pm}`));
  console.log(`Dependencies to install: ${chalk.cyan(deps.join(", "))}`);
  console.log(`Dev Dependencies to install: ${chalk.cyan(devDeps.join(", "))}`);

  const install = await promptConfirm(
    "Do you want to install these dependencies now?",
    true
  );

  if (!install) {
    return;
  }

  const installCmd = pm === "npm" ? "install" : "add";
  const devFlag = devFlagByPm[pm] ?? "-D";

  try {
    console.log(chalk.yellow("Installing dependencies..."));
    if (deps.length > 0) {
      await runCommand(pm, [installCmd, ...deps]);
    }

    console.log(chalk.yellow("Installing dev dependencies..."));
    if (devDeps.length > 0) {
      await runCommand(pm, [installCmd, devFlag, ...devDeps]);
    }

    console.log(chalk.green("Dependencies installed successfully!"));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red("Error installing dependencies:"), message);
  }
};

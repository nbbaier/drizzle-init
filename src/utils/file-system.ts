import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { promptConfirm } from "./prompts";

export const checkFileExists = (filepath: string): boolean => {
  return fs.existsSync(filepath);
};

export const safeWriteFile = async (
  filepath: string,
  content: string
): Promise<boolean> => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (checkFileExists(filepath)) {
    const overwrite = await promptConfirm(
      `File ${chalk.cyan(filepath)} already exists. Overwrite?`
    );

    if (!overwrite) {
      console.log(chalk.yellow(`Skipped ${filepath}`));
      return false;
    }
  }

  fs.writeFileSync(filepath, content, "utf8");
  return true;
};

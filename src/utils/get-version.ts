import { readFile } from "node:fs/promises";
import path from "node:path";

interface VersionInfo {
  version: string;
  desc: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const getVersion = async (): Promise<VersionInfo> => {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const data = await readFile(packageJsonPath, "utf8");

  const packageJson: unknown = JSON.parse(data);
  if (!isRecord(packageJson)) {
    throw new Error("package.json is not a valid JSON object");
  }

  const { description, version } = packageJson;
  if (typeof version !== "string" || typeof description !== "string") {
    throw new Error("package.json is missing version/description");
  }

  return { version, desc: description };
};

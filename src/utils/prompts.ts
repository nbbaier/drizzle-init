import { confirm, select } from "@inquirer/prompts";

export function promptList(
  message: string,
  choices: string[]
): Promise<string> {
  return select({
    message,
    choices: choices.map((c) => ({ name: c, value: c })),
  });
}

export function promptConfirm(
  message: string,
  defaultValue = false
): Promise<boolean> {
  return confirm({ message, default: defaultValue });
}

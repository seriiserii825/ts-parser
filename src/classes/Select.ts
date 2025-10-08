import { execSync } from "node:child_process";
import chalk from "chalk";
import { TOption } from "../types/TOption.js";

export default class Select {
  static selectOne(message: string, options: TOption[]): string {
    const values = options
      .map((opt) => opt.value)
      .filter((v): v is string => typeof v === "string" && !/^Symbol\(/.test(v));

    const input = values.join("\n");
    console.log(chalk.blue(message));

    const choice = execSync(`fzf --no-clear --height=10 --reverse`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "inherit"],
      input,
    }).trim();

    return choice;
  }

  static selectMultiple(message: string, options: TOption[]): string[] {
    const values = options
      .map((opt) => opt.value)
      .filter((v): v is string => typeof v === "string" && !/^Symbol\(/.test(v));

    const input = values.join("\n");
    console.log(chalk.blue(message));

    try {
      const output = execSync(`fzf --multi --no-clear --height=10 --reverse --prompt='Select> '`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "inherit"],
        input,
      })
        .trim()
        .split("\n");
      return output;
    } catch {
      return [];
    }
  }
}

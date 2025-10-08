import { execSync } from "node:child_process";
import chalk from "chalk";
import {TOption} from "../types/TOption.js";

export default class Select {
  static selectOne(message: string, options: TOption[]): string {
    const labels = options.map((o) => o.label);

    console.log(chalk.blue(message));
    let choice = "";
    try {
      choice = execSync(`fzf --no-clear --height=10 --reverse`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "inherit"],
        input: labels.join("\n"),
      }).trim();
    } catch {
      throw new Error("No selection made.");
    }

    const hit = options.find((o) => o.label === choice);
    if (!hit) throw new Error(`Choice "${choice}" not found`);
    return hit.value;
  }

  // Return the values of all picked options (strongly typed)
  static selectMultiple(
    message: string,
    options: TOption[]
  ) {
    const labels = options.map((o) => o.label);

    console.log(chalk.blue(message));
    try {
      const output = execSync(`fzf --multi --no-clear --height=10 --reverse --prompt='Select> '`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "inherit"],
        input: labels.join("\n"),
      })
        .trim()
        .split("\n")
        .filter(Boolean);

      // Map chosen labels back to their values
      const picked = options.filter((o) => output.includes(o.label)).map((o) => o.value);

      // If user hit ENTER with no selection, fzf echoes the current line or empty; normalize to []
      return picked;
    } catch {
      // ESC / cancel
      return [];
    }
  }
}

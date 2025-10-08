import { execSync } from "node:child_process";
import { TOption } from "../types/TOption.js";
import chalk from "chalk";
export default class Select {
  private options: TOption[];
  private message: string;
  constructor(options: TOption[], message: string) {
    this.options = options;
    this.message = message;
  }

  selectOne(): string {
    const values = this.options
      .map((opt) => opt.value)
      .filter((v): v is string => typeof v === "string" && !/^Symbol\(/.test(v));

    const input = values.join("\n");
    console.log(chalk.blue(this.message));

    const choice = execSync(
      `fzf --no-clear --height=10 --reverse`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "inherit"], input }, // pass items via stdin
    ).trim();

    return choice;
  }

  selectMultiple(): string[] {
    const values = this.options
      .map((opt) => opt.value)
      .filter((v): v is string => typeof v === "string" && !/^Symbol\(/.test(v));

    const input = values.join("\n");
    console.log(chalk.blue(this.message));

    try {
      return execSync(`fzf --multi --no-clear --height=10 --reverse --prompt='Select> '`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "inherit"],
        input,
      })
        .trim()
        .split("\n");
    } catch {
      return [];
    }
  }
}

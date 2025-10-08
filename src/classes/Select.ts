import { execSync } from "node:child_process";
export default class Select {
  private options: string[];
  constructor(options: string[]) {
    this.options = options;
  }

  selectOne(): string {
    const items = [...this.options].join("\n");
    const choice = execSync(`echo "${items}" | fzf --no-clear --height=10 --reverse`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "inherit"],
    }).trim();
    return choice;
  }
  selectMultiple(): string[] {
    const items = [...this.options].join("\n");

    try {
      const choices = execSync(
        `echo "${items}" | fzf --multi --no-clear --height=10 --reverse --prompt='Select> '`,
        { encoding: "utf8", stdio: ["pipe", "pipe", "inherit"] },
      )
        .trim()
        .split("\n");
      return choices;
    } catch (err) {
      return [];
    }
  }
}

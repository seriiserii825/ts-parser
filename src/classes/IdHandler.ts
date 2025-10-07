import chalk from "chalk";

export class IdHandler {
  private ids: string[];

  constructor(id: string[]) {
    this.ids = id;
  }

  private showTitle(title: string) {
    console.log(chalk.blue(title));
  }

  private emptyData(data: string[], message: string) {
    if (data.length === 0) {
      console.log(chalk.red(message));
      return;
    }
  }

  public all() {
    this.showTitle("All ids:");
    this.emptyData(this.ids, "No links found.");
    this.drawHtml(this.ids);
  }

  private drawHtml(ids: string[]) {
    for (const id of ids) {
        console.log(`<div id="${id}"></div>`);
    }
  }
}

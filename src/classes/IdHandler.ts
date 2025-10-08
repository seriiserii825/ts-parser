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

  public duplicates(){
    this.showTitle("Duplicate ids:");
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const id of this.ids) {
        if (seen.has(id)) {
            duplicates.add(id);
        } else {
            seen.add(id);
        }
    }
    const dupArray = Array.from(duplicates);
    this.emptyData(dupArray, "No duplicate ids found.");
    this.drawHtml(dupArray);
  }

  private drawHtml(ids: string[]) {
    for (const id of ids) {
        console.log(`<div id="${id}"></div>`);
    }
  }
}

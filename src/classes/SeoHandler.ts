import chalk from "chalk";
import { TSeoInfo } from "../types/THtmlResponse.js";
import { ColumnOptionsRaw } from "console-table-printer/dist/src/models/external-table.js";
import tablePrinter from "../utils/tablePrinter.js";
import table3 from "../utils/table3.js";

type TSeoType = "title" | "description" | "og_image" | "robots";

export class SeoHandler {
  private seo: TSeoInfo;
  constructor(seo: TSeoInfo) {
    this.seo = seo;
    this.emptyData("title");
  }
  private showTitle(title: string) {
    console.log(chalk.blue(title));
  }

  private emptyData(type: TSeoType) {
    if (type === "title" && !this.seo.title) {
      console.log(chalk.red("No seo title found."));
      return true;
    }
    if (type === "description" && !this.seo.description) {
      console.log(chalk.red("No seo description found."));
      return true;
    }
    if (type === "og_image" && !this.seo.ogImage) {
      console.log(chalk.red("No seo og image found."));
      return true;
    }
    if (type === "robots" && !this.seo.robots) {
      console.log(chalk.red("No seo robots found."));
      return true;
    }
  }

  public all() {
    this.showTitle("All seo:");
    this.seoTitle();
    this.seoDescription();
    this.seoOgImage();
    this.seoRobots();
  }

  public seoTitle() {
    this.showTitle("Seo title:");
    console.log(this.seo.title ? this.seo.title : chalk.red("No seo title found."));
  }
  public seoDescription() {
    this.showTitle("Seo description:");
    console.log(this.seo.description ? this.seo.description : chalk.red("No seo description found."));
  }
  public seoOgImage() {
    this.showTitle("Seo og image:");
    console.log(this.seo.ogImage ? this.seo.ogImage : chalk.red("No seo og image found."));
  }
  public seoRobots() {
    this.showTitle("Seo robots:");
    console.log(this.seo.robots ? this.seo.robots : chalk.red("No seo robots found."));
  }
}

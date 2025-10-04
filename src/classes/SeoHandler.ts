import chalk from "chalk";
import { TSeoInfo } from "../types/THtmlResponse.js";
import { ColumnOptionsRaw } from "console-table-printer/dist/src/models/external-table.js";
import tablePrinter from "../utils/tablePrinter.js";

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
    this.printTable()
  }
  public seoDescription() {
    this.showTitle("Seo description:");
    this.printTable()
  }
  public seoOgImage() {
    this.showTitle("Seo og image:");
    this.printTable()
  }
  public seoRobots() {
    this.showTitle("Seo robots:");
    this.printTable()
  }

  public printTable() {
    const columns: ColumnOptionsRaw[] = [
      { name: "Type", alignment: "left" },
      { name: "Content", alignment: "left", maxLen: 100 },
    ];

    const rows = [
      { Type: "Title", Content: this.seo.title || "N/A" },
      { Type: "Description", Content: this.seo.description || "N/A" },
      { Type: "Og Image", Content: this.seo.ogImage || "N/A" },
      { Type: "Robots", Content: this.seo.robots || "N/A" },
    ];

    tablePrinter({ columns, rows });
  }
}

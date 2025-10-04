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
    this.printTable('title');
  }
  public seoDescription() {
    this.showTitle("Seo description:");
    this.printTable('description');
  }
  public seoOgImage() {
    this.showTitle("Seo og image:");
    this.printTable('og_image');
  }
  public seoRobots() {
    this.showTitle("Seo robots:");
    this.printTable('robots');
  }

  public printTable(type?: "title" | "description" | "og_image" | "robots") {
    // маппинг твоих псевдонимов на реальные ключи в TSeoInfo
    const map: Record<NonNullable<typeof type>, keyof TSeoInfo> = {
      title: "title",
      description: "description",
      og_image: "ogImage",
      robots: "robots",
    };

    const row = this.seo;
    if (!type) {
      console.log(
        table3([row], ["title", "description", "ogImage", "robots"] as const, {
          head: ["Title", "Description", "OG Image", "Robots"] as const,
          colWidths: [40, 40, 40, 20] as const,
        })
      );
      return;
    }

    // печать одной колонки
    const key = map[type];
    console.log(
      table3([row], [key] as const, {
        head: [type.toUpperCase()] as const,
        colWidths: [60] as const,
      })
    );
  }
}

import chalk from "chalk";
import { TSeoInfo } from "../types/THtmlResponse.js";

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
    this.drawSeo(this.seo, "title");
  }
  public seoDescription() {
    this.showTitle("Seo description:");
    this.drawSeo(this.seo, "description");
  }
  public seoOgImage() {
    this.showTitle("Seo og image:");
    this.drawSeo(this.seo, "og_image");
  }
  public seoRobots() {
    this.showTitle("Seo robots:");
    this.drawSeo(this.seo, "robots");
  }

  private drawSeo(seo: TSeoInfo, type: TSeoType) {
    if (type === "title") {
      const title = seo.title ? `Title: "${seo.title}"` : "No title";
      console.log(title);
      return;
    }
    if (type === "description") {
      const description = seo.description ? `Description: "${seo.description}"` : "No description";
      console.log(description);
      return;
    }
    if (type === "og_image") {
      const og_image = seo.ogImage ? `OG Image: "${seo.ogImage}"` : "No OG image";
      console.log(og_image);
      return;
    }
    if (type === "robots") {
      const robots = seo.robots ? `Robots: "${seo.robots}"` : "No robots";
      console.log(robots);
      return;
    }
  }
}

import chalk from "chalk";
import { TLinkInfo } from "../types/THtmlResponse.js";

export class LinksHandler {
  private links: TLinkInfo[];
  constructor(links: TLinkInfo[]) {
    this.links = links;
  }
  private showTitle(title: string) {
    console.log(chalk.blue(title));
  }

  private emptyData(data: TLinkInfo[], message: string) {
    if (data.length === 0) {
      console.log(chalk.red(message));
      return;
    }
  }

  public all() {
    this.showTitle("All links:");
    this.emptyData(this.links, "No links found.");
    this.drawLinksHtml(this.links);
  }

  public empty() {
    const filtered = this.links.filter((link) => !link.url || link.url.trim() === "");
    if (filtered.length === 0) return;
    this.showTitle("Links with empty alt attribute:");
    this.drawLinksHtml(filtered);
  }
  public withHash() {
    const filtered = this.links.filter((link) => link.url.includes("#"));
    if (filtered.length === 0) return;
    this.showTitle("Links with hash:");
    this.drawLinksHtml(filtered);
  }
  private drawLinksHtml(links: TLinkInfo[]) {
    for (const link of links) {
      const link_html = `<a href="${link.url}">${link.text || link.url}</a>`;
      console.log(link_html);
    }
  }
}

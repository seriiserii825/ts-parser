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
    this.drawHtml(this.links);
  }

  public empty() {
    const filtered = this.links.filter((link) => !link.url || link.url.trim() === "");
    if (filtered.length === 0) return;
    this.showTitle("Links with empty alt attribute:");
    this.drawHtml(filtered);
  }
  public withHash() {
    const filtered = this.links.filter((link) => link.url.includes("#"));
    if (filtered.length === 0) return;
    this.showTitle("Links with hash:");
    this.drawHtml(filtered);
  }
  private drawHtml(links: TLinkInfo[]) {
    for (const link of links) {
      const rel = link.rel ? ` rel="${link.rel}"` : "";
      const target = link.target ? ` target="${link.target}"` : "";
      const link_html = `parent class: ${link.parent_class} -
      <a href="${link.url}" ${rel} ${target}>${link.text}</a>`;
      console.log(link_html);
    }
  }
}

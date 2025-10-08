import chalk from "chalk";
import { TLinkInfo } from "../types/THtmlResponse.js";

export class LinksHandler {
  private links: TLinkInfo[];
  private ids: string[];
  constructor(links: TLinkInfo[], ids: string[] = []) {
    this.links = links;
    this.ids = ids;
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

  public _getWithHash(): TLinkInfo[] | undefined {
    const filtered = this.links.filter((link) => link.url.includes("#"));
    if (filtered.length === 0) return;
    return filtered;
  }
  public brokenHash() {
    const links_with_hash = this._getWithHash();
    if (!links_with_hash) {
      console.log(chalk.red("No links with hash found."));
      return;
    }
    if (this.ids.length === 0) {
      console.log(chalk.red("No ids found to compare."));
      return;
    }
    const broken_links = links_with_hash.filter((link) => {
      const hash_index = link.url.indexOf("#");
      if (hash_index === -1) return false;
      const hash = link.url.substring(hash_index + 1);
      return !this.ids.includes(hash);
    });
    if (broken_links.length === 0) {
      console.log(chalk.green("No broken hash links found."));
      return;
    }
    this.showTitle(chalk.red("Links with broken hash:"));
    console.log(chalk.yellow(`Found ${broken_links.length} broken hash link(s).`));
    this.drawHtml(broken_links);
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

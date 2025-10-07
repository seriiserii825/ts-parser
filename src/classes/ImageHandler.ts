import chalk from "chalk";
import { TImageInfo } from "../types/THtmlResponse.js";
import table3 from "../utils/table3.js";

export class ImageHandler {
  private images: TImageInfo[];
  constructor(images: TImageInfo[]) {
    this.images = images;
  }
  private showTitle(title: string) {
    console.log(chalk.blue(title));
  }

  private emptyData(data: TImageInfo[], message: string) {
    if (data.length === 0) {
      console.log(chalk.red(message));
      return;
    }
  }

  public all() {
    this.showTitle("All images:");
    this.emptyData(this.images, "No images found.");
    this.printTable(this.images);
  }

  public emptyAlt() {
    const filtered = this.images.filter((img) => !img.alt || img.alt.trim() === "");
    if (filtered.length === 0) return;
    this.showTitle("Images with empty alt attribute:");
    this.printTable(filtered);
  }
  public withAlt() {
    const filtered = this.images.filter((img) => img.alt && img.alt.trim() !== "");
    if (filtered.length === 0) return;
    this.showTitle("Images with filled alt attribute:");
    this.printTable(filtered);
  }
  public withLazyLoading() {
    const filtered = this.images.filter((img) => img.loading?.toLowerCase() === "lazy");
    if (filtered.length === 0) return;
    this.showTitle('Images with loading="lazy":');
    this.printTable(filtered);
  }
  public withoutLoadingAttribute() {
    const filtered = this.images.filter((img) => !img.loading || img.loading.trim() === "");
    if (filtered.length === 0) return;
    this.showTitle("Images without loading attribute:");
    this.printTable(filtered);
  }
  private drawHtml(images: TImageInfo[]) {
    for (const img of images) {
      const alt = img.alt ? ` alt="${img.alt}"` : "";
      const loading = img.loading ? ` loading="${img.loading}"` : "";
      const image_html = `<img src="${img.url}"${alt}${loading}>`;
      console.log(image_html);
    }
  }

  public printTable(filtered: TImageInfo[] = this.images) {
    const rows = filtered.map((img) => ({
      url: img.url || "",
      alt: img.alt || "",
      loading: img.loading || "",
      parent_class: img.parent_class || "",
    }));

    console.log(
      table3(rows, ["url", "alt", "loading", "parent_class"] as const, {
        head: ["URL", "ALT", "LOADING", "PARENT CLASS"] as const,
      })
    );
    return;
  }
}

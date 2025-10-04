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
    this.printTable();
  }

  public emptyAlt() {
    this.showTitle("Images with empty alt attribute:");
    const filtered = this.images.filter((img) => !img.alt || img.alt.trim() === "");
    this.emptyData(filtered, "No images with empty alt attribute found.");
    this.printTable(filtered);
  }
  public withAlt() {
    this.showTitle("Images with filled alt attribute:");
    const filtered = this.images.filter((img) => img.alt && img.alt.trim() !== "");
    this.emptyData(filtered, "No images with filled alt attribute found.");
    this.printTable(filtered);
  }
  public withLazyLoading() {
    this.showTitle('Images with loading="lazy":');
    const filtered = this.images.filter((img) => img.loading?.toLowerCase() === "lazy");
    this.emptyData(filtered, 'No images with loading="lazy" found.');
    this.printTable(filtered);
  }
  public withoutLoadingAttribute() {
    this.showTitle("Images without loading attribute:");
    const filtered = this.images.filter((img) => !img.loading || img.loading.trim() === "");
    this.emptyData(filtered, "No images without loading attribute found.");
    this.printTable(filtered);
  }
  private drawImageHtml(img: TImageInfo) {
    const alt = img.alt ? ` alt="${img.alt}"` : "";
    const loading = img.loading ? ` loading="${img.loading}"` : "";
    const image_html = `
    class: "${img.parent_class}"
    <img src="${img.url}" ${alt}${loading}>`;
    console.log(image_html);
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

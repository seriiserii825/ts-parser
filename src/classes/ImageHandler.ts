import chalk from "chalk";
import { TImageInfo } from "../types/THtmlResponse.js";

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
    this.drawImagesHtml(this.images);
  }

  public emptyAlt() {
    const filtered = this.images.filter((img) => !img.alt || img.alt.trim() === "");
    if (filtered.length === 0) return;
    this.showTitle("Images with empty alt attribute:");
    this.drawImagesHtml(filtered);
  }
  public withAlt() {
    const filtered = this.images.filter((img) => img.alt && img.alt.trim() !== "");
    if (filtered.length === 0) return;
    this.showTitle("Images with filled alt attribute:");
    this.drawImagesHtml(filtered);
  }
  public withLazyLoading() {
    const filtered = this.images.filter((img) => img.loading?.toLowerCase() === "lazy");
    if (filtered.length === 0) return;
    this.showTitle('Images with loading="lazy":');
    this.drawImagesHtml(filtered);
  }
  public withoutLoadingAttribute() {
    const filtered = this.images.filter((img) => !img.loading || img.loading.trim() === "");
    if (filtered.length === 0) return;
    this.showTitle("Images without loading attribute:");
    this.drawImagesHtml(filtered);
  }
  private drawImagesHtml(images: TImageInfo[]) {
    for (const img of images) {
      const alt = img.alt ? ` alt="${img.alt}"` : "";
      const loading = img.loading ? ` loading="${img.loading}"` : "";
      const image_html = `<img src="${img.url}"${alt}${loading}>`;
      console.log(image_html);
    }
  }
}

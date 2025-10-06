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
    this.drawImagesHtml(this.images)
  }

  public emptyAlt() {
    this.showTitle("Images with empty alt attribute:");
    const filtered = this.images.filter((img) => !img.alt || img.alt.trim() === "");
    this.emptyData(filtered, "No images with empty alt attribute found.");
    this.drawImagesHtml(filtered)
  }
  public withAlt() {
    this.showTitle("Images with filled alt attribute:");
    const filtered = this.images.filter((img) => img.alt && img.alt.trim() !== "");
    this.emptyData(filtered, "No images with filled alt attribute found.");
    this.drawImagesHtml(filtered)
  }
  public withLazyLoading() {
    this.showTitle('Images with loading="lazy":');
    const filtered = this.images.filter((img) => img.loading?.toLowerCase() === "lazy");
    this.emptyData(filtered, 'No images with loading="lazy" found.');
    this.drawImagesHtml(filtered)
  }
  public withoutLoadingAttribute() {
    this.showTitle("Images without loading attribute:");
    const filtered = this.images.filter((img) => !img.loading || img.loading.trim() === "");
    this.emptyData(filtered, "No images without loading attribute found.");
    this.drawImagesHtml(filtered)
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

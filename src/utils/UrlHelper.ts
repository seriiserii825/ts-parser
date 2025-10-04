import { Cheerio } from "cheerio";
import type { Element } from "domhandler"; // <— вот так правильнее

export class UrlHelper {
  static toAbsolute(href: string | undefined | null, base: string): string | null {
    if (!href) return null;
    const trimmed = href.trim();
    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("javascript:") ||
      trimmed.startsWith("data:") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:")
    ) {
      return null;
    }
    try {
      return new URL(trimmed, base).toString();
    } catch {
      return null;
    }
  }

  static resolveImageUrl($img: Cheerio<Element>, base: string): string | null {
    const src =
      $img.attr("src") ||
      $img.attr("data-src") ||
      $img.attr("data-original") ||
      $img.attr("data-lazy-src");

    const srcset = $img.attr("srcset") || $img.attr("data-srcset");
    if (srcset && !src) {
      const firstCandidate = srcset.split(",")[0]?.trim().split(/\s+/)[0];
      return UrlHelper.toAbsolute(firstCandidate, base);
    }
    return UrlHelper.toAbsolute(src, base);
  }
}

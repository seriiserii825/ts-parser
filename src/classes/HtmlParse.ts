import { load as loadHTML, CheerioAPI } from "cheerio";
import { TImageInfo, TLinkInfo, TSeoInfo } from "../types/THtmlResponse.js";
import { UrlHelper } from "../utils/UrlHelper.js";

export default class HtmlParse {
  private baseUrl: string;
  private timeoutMs: number;
  private userAgent: string;
  private _html: string | null = null;
  private _$: CheerioAPI | null = null;
  private _headers: Headers | null = null;

  constructor(url: string, opts: { timeoutMs?: number; userAgent?: string } = {}) {
    if (!/^https?:\/\//i.test(url)) throw new Error("Url must start with http(s)://");
    this.baseUrl = new URL(url).toString();
    this.timeoutMs = opts.timeoutMs ?? 15_000;
    this.userAgent =
      opts.userAgent ?? "Mozilla/5.0 (compatible; HtmlParseBot/1.0; +https://example.invalid/bot)";
  }

  private async fetchOnce() {
    if (this._$) return;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), this.timeoutMs);

    const res = await fetch(this.baseUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": this.userAgent,
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      redirect: "follow",
    }).finally(() => clearTimeout(t));

    if (!res.ok) throw new Error(`HTTP ${res.status} for ${this.baseUrl}`);

    this._headers = res.headers;
    this._html = await res.text();
    this._$ = loadHTML(this._html, { xmlMode: false });
  }

  async getSeo(): Promise<TSeoInfo> {
    await this.fetchOnce();
    const $ = this._$!;
    const title = $("head > title").first().text().trim() || null;

    const description = $('meta[name="description"]').attr("content")?.trim() || null;

    const ogRaw =
      $('meta[property="og:image"]').attr("content")?.trim() ||
      $('meta[name="og:image"]').attr("content")?.trim() ||
      null;
    const ogImage = ogRaw ? UrlHelper.toAbsolute(ogRaw, this.baseUrl) : null;

    const xRobots = this._headers?.get("x-robots-tag")?.trim() || null;
    const robots =
      xRobots ||
      $('meta[name="robots"]').attr("content")?.trim() ||
      $('meta[name="googlebot"]').attr("content")?.trim() ||
      null;

    return { title, description, ogImage, robots };
  }

  async getAllLinks(): Promise<TLinkInfo[]> {
    await this.fetchOnce();
    const $ = this._$!;
    const results: TLinkInfo[] = [];

    $("a[href]").each((_, el) => {
      const $a = $(el);
      const abs = UrlHelper.toAbsolute($a.attr("href"), this.baseUrl);
      if (!abs) return;

      const rel = $a.attr("rel")?.trim() || undefined;
      const target = $a.attr("target")?.trim() || undefined;
      const text = $a.text().replace(/\s+/g, " ").trim();

      let external = false;
      try {
        external = new URL(abs).origin !== new URL(this.baseUrl).origin;
      } catch {}

      const nofollow = /\bnofollow\b/i.test(rel || "");

      results.push({ url: abs, text, rel, target, external, nofollow });
    });

    // уникализация по url
    const seen = new Set<string>();
    return results.filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });
  }

  async getAllImages(): Promise<TImageInfo[]> {
    await this.fetchOnce();
    const $ = this._$!;
    const results: TImageInfo[] = [];

    $("img").each((_, el) => {
      const $img = $(el);
      const abs = UrlHelper.resolveImageUrl($img, this.baseUrl);
      if (!abs) return;
      const alt = $img.attr("alt")?.trim() || undefined;
      const width = Number($img.attr("width")) || undefined;
      const height = Number($img.attr("height")) || undefined;
      const loading = $img.attr("loading")?.trim() || undefined;
      results.push({ url: abs, alt, width, height, loading });
    });

    const seen = new Set<string>();
    return results.filter((img) => {
      if (seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    });
  }
}

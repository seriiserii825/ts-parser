import type * as cheerio from "cheerio";
import { load as loadHTML, CheerioAPI } from "cheerio";
import { promises as fs } from "node:fs";
import path from "node:path";
import { TImageInfo, TLinkInfo, TSeoInfo } from "../types/THtmlResponse.js";
import { UrlHelper } from "../utils/UrlHelper.js";

type ParseOpts = {
  timeoutMs?: number;
  userAgent?: string;
  /** Directory where HTML files are cached/saved. Default ".html-cache" */
  cacheDir?: string;
  /** Consider cache fresh for this many ms. If omitted, reuse forever. */
  maxAgeMs?: number;
  /** Force re-download even if a fresh cache exists. Overrides maxAgeMs. */
  force?: boolean;
};

export default class HtmlParse {
  private baseUrl: string;
  private timeoutMs: number;
  private userAgent: string;
  private cacheDir: string;
  private maxAgeMs?: number;
  private force: boolean;

  private _html: string | null = null;
  private _$: CheerioAPI | null = null;
  private _headers: Headers | null = null;

  constructor(url: string, opts: ParseOpts = {}) {
    if (!/^https?:\/\//i.test(url)) throw new Error("Url must start with http(s)://");
    this.baseUrl = new URL(url).toString();
    this.timeoutMs = opts.timeoutMs ?? 15_000;
    this.userAgent =
      opts.userAgent ?? "Mozilla/5.0 (compatible; HtmlParseBot/1.0; +https://example.invalid/bot)";
    this.cacheDir = opts.cacheDir ?? ".html-cache";
    this.maxAgeMs = opts.maxAgeMs;
    this.force = !!opts.force;
  }

  // ---------- Cache helpers ----------
  private urlToCachePaths(u: string) {
    const url = new URL(u);
    // Build a safe filename:
    // - / => path parts; empty path -> "index"
    // - query -> stable key=value pairs appended
    const parts = url.pathname.replace(/\/+/g, "/").split("/").filter(Boolean);
    const base = parts.length ? parts.join("_") : "index";
    const qs = url.searchParams.toString(); // already sorted insertion order; good enough
    const fileBase = (qs ? `${base}__${qs}` : base)
      .replace(/[^\w.-]+/g, "_") // keep word chars, dot, dash
      .replace(/_+/g, "_") // collapse
      .replace(/^_+|_+$/g, ""); // trim

    const dir = path.join(this.cacheDir, url.hostname);
    const htmlPath = path.join(dir, `${fileBase}.html`);
    const headersPath = path.join(dir, `${fileBase}.headers.json`);
    return { dir, htmlPath, headersPath };
  }

  private async readCache(): Promise<{ html: string; headers?: Headers } | null> {
    const { htmlPath, headersPath } = this.urlToCachePaths(this.baseUrl);
    try {
      // If maxAgeMs is set, check staleness by mtime
      if (!this.force && this.maxAgeMs != null) {
        const st = await fs.stat(htmlPath);
        const age = Date.now() - st.mtimeMs;
        if (age > this.maxAgeMs) return null; // stale
      }
      const html = await fs.readFile(htmlPath, "utf8");
      let headers: Headers | undefined;
      try {
        const raw = await fs.readFile(headersPath, "utf8");
        const obj = JSON.parse(raw) as Record<string, string>;
        headers = new Headers(obj);
      } catch {
        /* no headers cached */
      }
      return { html, headers };
    } catch {
      return null;
    }
  }

  private async writeCache(html: string, headers: Headers | null) {
    const { dir, htmlPath, headersPath } = this.urlToCachePaths(this.baseUrl);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(htmlPath, html, "utf8");
    if (headers) {
      const obj: Record<string, string> = {};
      headers.forEach((v, k) => (obj[k] = v));
      await fs.writeFile(headersPath, JSON.stringify(obj, null, 2), "utf8");
    }
  }

  // ---------- Fetch (with cache) ----------
  private async fetchOnce() {
    if (this._$) return;

    // Try cache first (unless force)
    if (!this.force) {
      const cached = await this.readCache();
      if (cached) {
        this._html = cached.html;
        this._headers = cached.headers ?? null;
        this._$ = loadHTML(this._html, { xmlMode: false });
        return;
      }
    }

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

    const ct = res.headers.get("content-type") || "";
    // Optional: only cache/parse HTML-like responses
    if (!/text\/html|application\/xhtml\+xml/i.test(ct)) {
      // Still allow reading, but you may choose to throw instead
    }

    this._headers = res.headers;
    this._html = await res.text();

    // Save to disk cache
    await this.writeCache(this._html, this._headers);

    this._$ = loadHTML(this._html, { xmlMode: false });
  }

  // ---------- Public API ----------
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

    $("a").each((_, el) => {
      const $a = $(el);
      const rawHref = $a.attr("href"); // не трогаем
      const href = rawHref?.trim() ?? ""; // "" если пустой, undefined -> ""
      const abs = UrlHelper.toAbsolute(rawHref, this.baseUrl) ?? "";

      const rel = $a.attr("rel")?.trim() || undefined;
      const target = $a.attr("target")?.trim() || undefined;
      const text = $a.text().replace(/\s+/g, " ").trim();

      let external = false;
      try {
        if (abs) external = new URL(abs).origin !== new URL(this.baseUrl).origin;
      } catch {}

      const nofollow = /\bnofollow\b/i.test(rel || "");
      const parent_class = this.findNearestParentClass($a) || "";

      results.push({ url: abs, href, text, rel, target, external, nofollow, parent_class });
    });

    return results;
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
      const name = abs.split("/").pop() || abs;
      const width = Number($img.attr("width")) || undefined;
      const height = Number($img.attr("height")) || undefined;
      const loading = $img.attr("loading")?.trim() || undefined;
      const parent_class = this.findNearestParentClass($img) || "";
      results.push({ url: abs, name, alt, width, height, loading, parent_class });
    });

    const seen = new Set<string>();
    return results.filter((img) => {
      if (seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    });
  }

  async getAllIds(): Promise<string[]> {
    await this.fetchOnce();
    const $ = this._$!;
    const results: string[] = [];
    const excludedTags = new Set(["script", "style", "noscript", "g", "svg", "clipPath", "defs"]);

    // find all elements with id
    $("body [id]").each((_, el) => {
      const $el = $(el);
      const tag = $el.prop("tagName")?.toLowerCase();
      if (!tag) return;
      // skip unwanted tags or if inside svg
      if (excludedTags.has(tag) || $el.closest("svg").length > 0) return;

      const id = $el.attr("id")?.trim();
      if (id && !/^url\(#.+\)$/.test(id)) {
        results.push(id);
      }
    });

    return results;
  }

  async getAll(): Promise<{
    seo: TSeoInfo;
    links: TLinkInfo[];
    images: TImageInfo[];
    ids: string[];
  }> {
    await this.fetchOnce();
    const [seo, links, images, ids] = await Promise.all([
      this.getSeo(),
      this.getAllLinks(),
      this.getAllImages(),
      this.getAllIds(),
    ]);
    return { seo, links, images, ids };
  }

  private findNearestParentClass($el: cheerio.Cheerio<cheerio.Element>): string | null {
    let $p = $el.parent();
    while ($p.length) {
      const cls = $p.attr("class")?.trim();
      if (cls) return cls;
      $p = $p.parent();
    }
    return null;
  }
}

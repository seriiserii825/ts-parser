import { load as loadXML } from "cheerio";

export default class XmlParse {
  private timeoutMs: number;
  private userAgent: string;

  constructor(opts: { timeoutMs?: number; userAgent?: string } = {}) {
    this.timeoutMs = opts.timeoutMs ?? 15_000;
    this.userAgent =
      opts.userAgent ?? "Mozilla/5.0 (compatible; XmlParseBot/1.0; +https://example.invalid/bot)";
  }

  /** Parse <loc> links from an XML (sitemap or sitemap index) */
  async parseLocLinks(xmlUrl: string): Promise<string[]> {
    if (!/^https?:\/\//i.test(xmlUrl)) {
      throw new Error("xmlUrl must start with http(s)://");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let xml: string;
    let ct: string | null = null;

    try {
      const res = await fetch(xmlUrl, {
        signal: controller.signal,
        headers: {
          "user-agent": this.userAgent,
          accept: "application/xml,text/xml,*/*;q=0.8",
        },
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${xmlUrl}`);
      ct = res.headers.get("content-type");
      xml = await res.text();
    } finally {
      clearTimeout(timer);
    }

    if (!(ct?.includes("xml") || /\.xml(\?.*)?$/i.test(xmlUrl))) {
      throw new Error(`Not XML (Content-Type: ${ct || "unknown"}) for ${xmlUrl}`);
    }

    const $ = loadXML(xml, { xmlMode: true });
    const links: string[] = [];

    $("loc").each((_, el) => {
      const raw = $(el).text().trim();
      if (raw) {
        try {
          const abs = new URL(raw, xmlUrl).toString();
          links.push(abs);
        } catch {
          /* skip malformed */
        }
      }
    });

    // dedupe while preserving order
    const seen = new Set<string>();
    return links.filter((u) => (seen.has(u) ? false : (seen.add(u), true)));
  }
}

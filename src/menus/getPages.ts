import chalk from "chalk";
import HtmlParse from "../classes/HtmlParse.js";
import { TImageInfo, TSeoInfo } from "../types/THtmlResponse.js";
import {TSection} from "../types/TSection.js";
import {TPage} from "../types/TPage.js";

export default async function getPages(urls: string[], section: TSection): Promise<TPage[]> {
  const pages: TPage[] = [];
  for (const url of urls) {
    const parser = new HtmlParse(url);
    console.log(chalk.yellow(`\n— Processing: ${url}`));

    if (section === "seo") {
      const seo = await parser.getSeo();
      pages.push({url: url , seo, images: [] });
    }

    if (section === "images") {
      const images = await parser.getAllImages();
      pages.push({url: url, seo: {} as TSeoInfo, images });
    }

    if (section === "links") {
      const links = await parser.getAllLinks();
      console.log("Links:", links);
    }
  }
  return pages;
}

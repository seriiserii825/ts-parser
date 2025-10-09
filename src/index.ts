#!/usr/bin/env node

import chalk from "chalk";
import fileMenu from "./modules/fileMenu.js";
import mainMenu from "./menus/mainMenu.js";
import getUrlLinks from "./menus/getUrlLinks.js";
import HtmlParse from "./classes/HtmlParse.js";
import { SeoHandler } from "./classes/SeoHandler.js";
import { ImageHandler } from "./classes/ImageHandler.js";
import { LinksHandler } from "./classes/LinksHandler.js";
import { IdHandler } from "./classes/IdHandler.js";

async function main() {
  const url = await fileMenu();
  if (!url) {
    console.log(chalk.red("No URL selected. Exiting..."));
    return;
  }

  const menu_options = await mainMenu();

  const url_links = await getUrlLinks(url);
  if (!url_links) {
    console.log(chalk.red("No links found. Exiting..."));
    return;
  }

  for (const url of url_links) {
    const parser = new HtmlParse(url);
    console.log(chalk.yellow(`\n— Processing: ${url}`));
    const all = await parser.getAll();
    for (const option of menu_options) {
      const seo = new SeoHandler(all.seo);
      const images = new ImageHandler(all.images);
      const links = new LinksHandler(all.links, all.ids);
      const ids = new IdHandler(all.ids);

      switch (option) {
        case "seo_all":
          seo.all();
          break;
        case "seo_missing":
          seo.seoMissing();
          break;
        case "missing_alt":
          images.emptyAlt();
          break;
        case "links_empty":
          links.empty();
          break;
        case "links_external":
          links.checkExternalLinks();
          break;
        case "links_broken_hash":
          links.brokenHash();
          break;
        case "phone_whatsapp":
          links.phoneWhatsapp();
          break;
        case "ids_duplicates":
          ids.duplicates();
          break;
        default:
          break;
      }
    }
  }
}

main();

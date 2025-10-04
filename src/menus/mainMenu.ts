import { isCancel, select } from "@clack/prompts";
import HtmlParse from "../classes/HtmlParse.js";
import seoMenu from "./seoMenu.js";
import imageMenu from "./imageMenu.js";
import htmlMenu from "./htmlMenu.js";
import chalk from "chalk";

type Section = "seo" | "images" | "links" | "exit";

export default async function mainMenu(urls: string[]): Promise<void> {
  // бесконечный цикл, чтобы после выполнения по всем ссылкам можно было выбрать новое действие
  while (true) {
    const section = (await select({
      message: "What to extract (applies to ALL passed URLs)?",
      options: [
        { label: "SEO", value: "seo" },
        { label: "Images", value: "images" },
        { label: "Links", value: "links" },
        { label: "Exit", value: "exit" },
      ] as const,
    })) as Section | symbol;

    if (isCancel(section) || section === "exit") return;

    const menu_choices = {
      seo: [] as string[],
      images: [] as string[],
      links: [] as string[],
    };

    if (section === "seo") {
      menu_choices.seo = await htmlMenu([
        { label: "All", value: "all" },
        { label: "Title", value: "title" },
        { label: "Description", value: "description" },
        { label: "Og Image", value: "og_image" },
        { label: "Robots", value: "robots" },
        { label: "Back", value: "back" },
        { label: "Exit", value: "exit" },
      ]);
    }

    if (section === "images") {
      menu_choices.images = await htmlMenu([
        { label: "All", value: "all" },
        { label: "With alt", value: "alt" },
        { label: "Without alt", value: "no-alt" },
        { label: 'With loading="lazy"', value: "lazy" },
        { label: "Without loading attribute", value: "no-loading" },
        { label: "Back", value: "back" },
        { label: "Exit", value: "exit" },
      ]); 
    }

    // прогоняем выбранное действие по всем URL
    for (const url of urls) {
      const parser = new HtmlParse(url);
      console.log(chalk.yellow(`\n— Processing: ${url}`));

      if (section === "seo") {
        const seo = await parser.getSeo();
        const res = await seoMenu(seo, menu_choices.seo);
        if (res === "exit") return;
      }

      if (section === "links") {
        const links = await parser.getAllLinks();
        console.log("Links:", links);
      }

      if (section === "images") {
        const images = await parser.getAllImages();
        const res = await imageMenu(images, menu_choices.images); // если внутри будет "exit" — выходим глобально
        if (res === "exit") return;
      }
    }

    // после прохода по всем ссылкам предложим выбрать следующее действие
    const again = (await select({
      message: "Run another action for ALL URLs?",
      options: [
        { label: "Yes", value: "again" },
        { label: "Exit", value: "exit" },
      ] as const,
    })) as "again" | "exit" | symbol;

    if (isCancel(again) || again === "exit") return;
  }
}

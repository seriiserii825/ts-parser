import { isCancel, select } from "@clack/prompts";
import { TSeoSubMenu } from "../data/seo_sub_menu_data.js";
import getMenuSection from "./getMenuSection.js";
import { TPage } from "../types/TPage.js";
import getPages from "./getPages.js";
import getSeoSubMenu from "./getSeoSubMenu.js";
import getImagesSubMenu from "./getImagesSubMenu.js";
import chalk from "chalk";

export default async function mainMenu(urls: string[]): Promise<void> {
  while (true) {
    const section = await getMenuSection();
    if (isCancel(section) || section === "exit") return;

    const pages: TPage[] = await getPages(urls, section);

    const menu_choices: {
      seo?: TSeoSubMenu[];
      images?: string[];
    } = {};

    if (section === "seo") {
      menu_choices.seo = await getSeoSubMenu();
    }

    if (section === "images") {
      menu_choices.images = await getImagesSubMenu();
    }

    for (const page of pages) {
      if (section === "seo" && page.seo && menu_choices.seo) {
        const seoMenu = await import("./seoMenu.js");
        console.log(chalk.yellow(`\n— Results for: ${page.url} —`));
        const res = await seoMenu.default(page.seo, menu_choices.seo);
        if (res === "exit") return;
      }

      // if (section === "images" && page.images && menu_choices.images) {
      //   const imagesMenu = await import("./imagesMenu.js");
      //   const res = await imagesMenu.default(page.images, menu_choices.images);
      //   if (res === "exit") return;
      // }
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

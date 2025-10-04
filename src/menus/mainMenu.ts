import { isCancel, select } from "@clack/prompts";
import HtmlParse from "../classes/HtmlParse.js";
import seoMenu from "./seoMenu.js";
import imageMenu from "./imageMenu.js";

export default async function mainMenu(url: string): Promise<void> {
  async function run() {
    while (true) {
      const parser = new HtmlParse(url);

      // цикл разделов для выбранного URL
      sectionLoop: while (true) {
        const section = await select({
          message: `What to extract for ${url}?`,
          options: [
            { label: "SEO", value: "seo" },
            { label: "Images", value: "images" },
            { label: "Links", value: "links" },
            { label: "Change URL (Back)", value: "change-url" },
            { label: "Exit", value: "exit" },
          ],
        });

        if (isCancel(section) || section === "exit") return;
        if (section === "change-url") break sectionLoop; // вверх на выбор URL

        if (section === "seo") {
          const seo = await parser.getSeo();
          const res = await seoMenu(seo);
          if (res === "exit") return; // глобальный выход
        }

        if (section === "links") {
          const links = await parser.getAllLinks();
          console.log("Links:", links);
          continue;
        }

        if (section === "images") {
          const images = await parser.getAllImages();
          // подменю картинок само крутится, пока не вернёт назад/exit
          const res = await imageMenu(images); // 'back' | 'exit'
          if (res === "exit") return; // глобальный выход
          // если 'back' — просто продолжаем цикл разделов
        }
      }
      // вернулись к выбору URL — цикл while(true) продолжится и заново спросит URL
    }
  }

  await run();
}

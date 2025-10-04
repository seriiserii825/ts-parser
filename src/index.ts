#!/usr/bin/env node
import { select, confirm, isCancel } from "@clack/prompts";
import HtmlParse from "./classes/HtmlParse.js";
import mainMenu from "./modules/mainMenu.js";
import imageMenu from "./menus/imageMenu.js";

async function pause(msg = "Back") {
  await confirm({ message: msg, initialValue: true, active: "OK", inactive: "Cancel" });
}

async function run() {
  while (true) {
    const url = await mainMenu(); // внутри mainMenu добавьте пункт Exit → возвращайте null
    if (!url) {
      // пользователь выбрал Exit на уровне выбора URL
      return;
    }

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
        console.log("SEO:", seo);
        await pause();
        continue;
      }

      if (section === "links") {
        const links = await parser.getAllLinks();
        console.log("Links:", links);
        await pause();
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

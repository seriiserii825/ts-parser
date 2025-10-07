import { TSeoInfo } from "../types/THtmlResponse.js";
import { SeoHandler } from "../classes/SeoHandler.js";
import {TSeoSubMenu} from "../data/seo_sub_menu_data.js";
import {TPage} from "../types/TPage.js";

type MenuResult = "back" | "exit";

export default async function seoMenu(page: TPage, choices: TSeoSubMenu[]): Promise<MenuResult | void> {
  const seo: TSeoInfo = page.seo;
  const so = new SeoHandler(seo);
  // Exit всегда имеет приоритет
  if (choices.includes("exit")) return "exit";

  // Пустой выбор — просто покажем меню снова
  if (choices.length === 0) {
    console.log("No options selected. Choose at least one or Back/Exit.");
  }

  // Если выбран только Back — выходим на уровень вверх
  if (choices.length === 1 && choices[0] === "back") {
    return "back";
  }

  // Иначе выполняем выбранные действия (игнорируем 'back', если выбрали вместе с остальными)
  for (const c of choices) {
    switch (c) {
      case "all":
        so.all();
        break;
      case "title":
        so.seoTitle();
        break;
      case "description":
        so.seoDescription();
        break;
      case "og_image":
        so.seoOgImage();
        break;
      case "robots":
        so.seoRobots();
        break;
      case "missing":
        so.seoMissing();
        break;
      case "back":
      case "exit":
        // обработали выше
        break;
    }
  }
}

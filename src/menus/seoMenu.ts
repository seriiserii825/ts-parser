import {TSeoInfo} from "../types/THtmlResponse.js";
import {SeoHandler} from "../classes/SeoHandler.js";
import htmlMenu from "./htmlMenu.js";

type MenuResult = "back" | "exit";

export default async function seoMenu(seo: TSeoInfo): Promise<MenuResult> {
  const so = new SeoHandler(seo);
  while (true) {
    const choices = await htmlMenu([
      { label: "All", value: "all" },
      { label: "Title", value: "title" },
      { label: "Description", value: "description" },
      { label: "Og Image", value: "og_image" },
      { label: "Robots", value: "robots" },
      { label: "Back", value: "back" },
      { label: "Exit", value: "exit" },
    ]); 

    // Exit всегда имеет приоритет
    if (choices.includes("exit")) return "exit";

    // Пустой выбор — просто покажем меню снова
    if (choices.length === 0) {
      console.log("No options selected. Choose at least one or Back/Exit.");
      continue;
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
        case "back":
        case "exit":
          // обработали выше
          break;
      }
    }

    // после выполнения остаёмся в цикле → можно снова выбрать что-то или выйти Back/Exit
  }
}

import {LinksHandler} from "../classes/LinksHandler.js";
import { TLinkInfo } from "../types/THtmlResponse.js";

type MenuResult = "back" | "exit";

export default async function linksMenu(
  links: TLinkInfo[],
  choices: string[]
): Promise<MenuResult | void> {
  const lh = new LinksHandler(links);

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
        lh.all();
        break;
      case "empty":
        lh.empty()
        break;
      case "hash":
        lh.withHash();
        break;
      case "back":
      case "exit":
        // обработали выше
        break;
    }
  }
}

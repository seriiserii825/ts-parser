import { TImageInfo } from "../types/THtmlResponse.js";
import { ImageHandler } from "../classes/ImageHandler.js";

type ImageMenuResult = "back" | "exit";

export default async function imageMenu(
  images: TImageInfo[],
  choices: string[]
): Promise<ImageMenuResult | void> {
  const ih = new ImageHandler(images);

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
        ih.all();
        break;
      case "alt":
        ih.withAlt();
        break;
      case "no-alt":
        ih.emptyAlt();
        break;
      case "lazy":
        ih.withLazyLoading();
        break;
      case "no-loading":
        ih.withoutLoadingAttribute();
        break;
      case "back":
      case "exit":
        // обработали выше
        break;
    }
  }
}

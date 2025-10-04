import { TImageInfo } from "../types/THtmlResponse.js";
import htmlMenu from "./htmlMenu.js";
import { ImageHandler } from "../classes/ImageHandler.js";

type ImageMenuResult = "back" | "exit";

export default async function imageMenu(images: TImageInfo[]): Promise<ImageMenuResult> {
  const ih = new ImageHandler(images);

  while (true) {
    const choices = await htmlMenu([
      { label: "All", value: "all" },
      { label: "With alt", value: "alt" },
      { label: "Without alt", value: "no-alt" },
      { label: 'With loading="lazy"', value: "lazy" },
      { label: "Without loading attribute", value: "no-loading" },
      { label: "Back", value: "back" },
      { label: "Exit", value: "exit" },
    ]); // <-- multiselect → string[]

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

    // после выполнения остаёмся в цикле → можно снова выбрать что-то или выйти Back/Exit
  }
}

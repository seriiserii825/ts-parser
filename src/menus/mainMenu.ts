import { isCancel, select } from "@clack/prompts";
import HtmlParse from "../classes/HtmlParse.js";
import seoMenu from "./seoMenu.js";
import imageMenu from "./imageMenu.js";
import { html_menu_data, THtmlMenuValue } from "../data/html_menu_data.js";

type Section = THtmlMenuValue; // "seo" | "images" | "links" | "exit"

export default async function mainMenu(
  url: string,
  choices: readonly THtmlMenuValue[] = []
): Promise<void> {
  const parser = new HtmlParse(url);

    console.log(choices, "choices");

  const runSection = async (section: Section): Promise<"continue" | "exit"> => {
    if (section === "exit") return "exit";

    if (section === "seo") {
      const seo = await parser.getSeo();
      const res = await seoMenu(seo); // returns 'exit' | something
      if (res === "exit") return "exit";
      return "continue";
    }

    if (section === "links") {
      const links = await parser.getAllLinks();
      console.log("Links:", links);
      return "continue";
    }

    if (section === "images") {
      const images = await parser.getAllImages();
      const res = await imageMenu(images); // 'back' | 'exit'
      if (res === "exit") return "exit";
      return "continue";
    }

    // на всякий
    return "continue";
  };

  // 1) Непосредственное выполнение переданных choices (без интерактива)
  if (choices.length > 0) {
    // Опционально: фильтр от невалидных значений (на случай внешнего ввода)
    const allowed = new Set<Section>([...html_menu_data.map((item) => item.value)]);
    console.log("allowed", allowed);
    for (const c of choices) {
        console.log(c, "c");
      if (!allowed.has(c)) continue;
      const res = await runSection(c);
      console.log("res", res);
      if (res === "exit") return;
    }
    return; // всё выполнили — выходим
  }

  // 2) Интерактивный режим (циклом, пока не выберут exit / cancel)
  while (true) {
    const picked = await select({
      message: `What to extract for ${url}?`,
      options: html_menu_data, // [{ label, value }, ...] с value: THtmlMenuValue
    });

    if (isCancel(picked)) return;

    const section = picked as Section;
    const result = await runSection(section);
    if (result === "exit") return;
    // иначе — продолжаем цикл и снова показываем меню
  }
}

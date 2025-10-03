import { addUrl, clearFile, editUrl, ensureUrlsFile, listUrls, removeUrls } from "./getDomain.js";
import chalk from "chalk";
import { select } from "@clack/prompts";

export default async function mainMenu(): Promise<void> {
  await ensureUrlsFile();

  while (true) {
    const action = await select({
      message: "Меню",
      options: [
        { label: "Просмотреть", value: "list" },
        { label: "Добавить", value: "add" },
        { label: "Редактировать", value: "edit" },
        { label: "Удалить", value: "remove" },
        { label: "Очистить", value: "clear" },
        { label: "Выход", value: "exit" },
      ],
    });

    try {
      if (action === "list") await listUrls();
      else if (action === "add") {
        await addUrl();
        await listUrls();
      } else if (action === "edit") await editUrl();
      else if (action === "remove") await removeUrls();
      else if (action === "clear") await clearFile();
      else if (action === "exit") break;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(chalk.red("Ошибка:"), msg);
    }
  }
}

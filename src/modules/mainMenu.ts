import { addUrl, clearFile, editUrl, ensureUrlsFile, listUrls, removeUrls, selectUrl } from "./getDomain.js";
import chalk from "chalk";
import chalkSelect from "../utils/chalkSelect.js";

export default async function mainMenu(): Promise<string | undefined> {
  await ensureUrlsFile();

  while (true) {
    const message = "Меню";
    const options = [
      { label: "Просмотреть", value: "list" },
      { label: "Выбрать", value: "select" },
      { label: "Добавить", value: "add" },
      { label: "Редактировать", value: "edit" },
      { label: "Удалить", value: "remove" },
      { label: "Очистить", value: "clear" },
      { label: "Выход", value: "exit" },
    ];
    const action = await chalkSelect({ message, options });

    try {
      if (action === "list") await listUrls();
      else if (action === "select") {
        const url = await selectUrl()
        return url;
      }
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

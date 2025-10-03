import chalk from "chalk";
import chalkSelect from "../utils/chalkSelect.js";
import UrlsManager from "./getDomain.js";

export default async function mainMenu(): Promise<string | undefined> {
  await UrlsManager.ensureUrlsFile();

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
      if (action === "list") await UrlsManager.list();
      else if (action === "select") {
        const url = await UrlsManager.select()
        return url;
      }
      else if (action === "add") {
        await UrlsManager.add();
        await UrlsManager.list();
      } else if (action === "edit") await UrlsManager.edit();
      else if (action === "remove") await UrlsManager.remove();
      else if (action === "clear") await UrlsManager.clear();
      else if (action === "exit") break;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(chalk.red("Ошибка:"), msg);
    }
  }
}

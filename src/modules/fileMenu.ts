import chalk from "chalk";
import chalkSelect from "../utils/chalkSelect.js";
import UrlsManager from "./getDomain.js";
import { TOption } from "../types/TOption.js";

export default async function fileMenu(): Promise<string | undefined> {
  await UrlsManager.ensureUrlsFile();

  while (true) {
    const message = "File Menu: choose an action";
    const options: TOption[] = [
      { label: "View", value: "list" },
      { label: "Select", value: "select" },
      { label: "Add", value: "add" },
      { label: "Edit", value: "edit" },
      { label: "Delete", value: "remove" },
      { label: "Clear", value: "clear" },
      { label: "Exit", value: "exit" },
    ];
    const action = await chalkSelect({ message, options });

    try {
      if (action === "list") await UrlsManager.list();
      else if (action === "select") {
        const url = await UrlsManager.select();
        return url;
      } else if (action === "add") {
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

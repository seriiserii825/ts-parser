import chalk from "chalk";
import { TPage } from "../types/TPage.js";
import {IdHandler} from "../classes/IdHandler.js";
import {TIdsSubMenu} from "./getIdsSubmenu.js";

export default async function idsMenu(
  page: TPage,
  choices: TIdsSubMenu[],
): Promise<TIdsSubMenu | void> {
  const ids: string[] = page.ids ?? [];
  const lh = new IdHandler(ids);

  if (choices.includes("exit")) return "exit";

  if (choices.length === 0) {
    console.log("No options selected. Choose at least one or Back/Exit.");
  }

  if (choices.length === 1 && choices[0] === "back") {
    return "back";
  }

  for (const c of choices) {
    switch (c) {
      case "all":
        printUrl();
        lh.all();
        break;
      case "duplicates":
        printUrl();
        lh.duplicates();
        break;
      case "back":
      case "exit":
        break;
    }
  }

  function printUrl(){
    console.log(chalk.blue.bold(`\nURL: ${page.url}`));
  }
}

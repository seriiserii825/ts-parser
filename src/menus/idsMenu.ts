import chalk from "chalk";
import { TPage } from "../types/TPage.js";
import {IdHandler} from "../classes/IdHandler.js";

type MenuResult = "back" | "exit";

export default async function idsMenu(
  page: TPage,
  choices: string[]
): Promise<MenuResult | void> {
  const ids: string[] = page.ids;
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
      case "empty":
        printUrl();
        lh.empty();
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

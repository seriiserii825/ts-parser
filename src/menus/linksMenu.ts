import chalk from "chalk";
import { LinksHandler } from "../classes/LinksHandler.js";
import { TLinkInfo } from "../types/THtmlResponse.js";
import { TPage } from "../types/TPage.js";

type MenuResult = "back" | "exit";

export default async function linksMenu(
  page: TPage,
  choices: string[]
): Promise<MenuResult | void> {
  const links: TLinkInfo[] = page.links;
  const lh = new LinksHandler(links);

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
      case "hash":
        printUrl();
        lh.withHash();
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

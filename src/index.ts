#!/usr/bin/env node

import chalk from "chalk";
import fileMenu from "./modules/fileMenu.js";
import mainMenu from "./menus/mainMenu.js";
import xmlMenu from "./menus/xmlMenu.js";
import chalkSelect from "./utils/chalkSelect.js";

async function main() {
  const url = await fileMenu();
  if (!url) {
    console.log(chalk.red("No URL selected. Exiting..."));
    return;
  }

  const choice = await chalkSelect({
    message: "You selected:",
    options: [
      { label: "Home page", value: "page" },
      { label: "Sitemap", value: "sitemap" },
      { label: "Exit", value: "exit" },
    ],
  });

  if (choice.includes("exit")) {
    console.log(chalk.red("Exiting..."));
    return;
  }
  if (choice.includes("page")) {
    await mainMenu([url]);
  }
  if (choice.includes("sitemap")) {
    await xmlMenu(url);
  }
}

main();

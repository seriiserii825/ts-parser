#!/usr/bin/env node

import chalk from "chalk";
import htmlMenu from "./menus/htmlMenu.js";
import fileMenu from "./modules/fileMenu.js";
import mainMenu from "./menus/mainMenu.js";

async function main() {
  const url = await fileMenu();
  if (!url) {
    console.log(chalk.red("No URL selected. Exiting..."));
    return;
  }

  const choice = await htmlMenu([
    { label: "Home page", value: "page" },
    { label: "Sitemap", value: "sitemap" },
    { label: "Exit", value: "exit" },
  ]);
  if (choice.includes("exit")) {
    console.log(chalk.red("Exiting..."));
    return;
  }
  if (choice.includes("page")) {
    await mainMenu(url);
  }
  if (choice.includes("sitemap")) {
    console.log(chalk.yellow("Sitemap feature is not implemented yet."));
  }
}

main();

#!/usr/bin/env node

import chalk from "chalk";
import fileMenu from "./modules/fileMenu.js";
import mainMenu from "./menus/mainMenu.js";
import {TMainMenuValues} from "./types/TMainMenuValues.js";

async function main() {
  const url = await fileMenu();
  if (!url) {
    console.log(chalk.red("No URL selected. Exiting..."));
    return;
  }

  const menu_options = await mainMenu() as TMainMenuValues[];
}

main();

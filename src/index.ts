#!/usr/bin/env node

import mainMenu from "./modules/mainMenu.js";
import chalkInput from "./utils/chalkInput.js";
import ClipboardManager from "./utils/clipboardManager.js";

const url = await mainMenu();
console.log("url", url);

// const clipboard = await ClipboardManager.read();
// console.log("clipboard", clipboard);

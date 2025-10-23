// src/utils/UrlsManager.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import chalk from "chalk";
import pkg from "enquirer";

import chalkSelect from "../utils/chalkSelect.js";
import chalkMultiSelect from "../utils/chalkMultiSelect.js";
import chalkInput from "../utils/chalkInput.js";
import ClipboardManager from "../utils/clipboardManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { prompt } = pkg;

export default class UrlsManager {
  static FILE_NAME = "urls.txt";

  // ---------- Helpers ----------
  private static getUrlsPath(): string {
    // return path.resolve(process.cwd(), UrlsManager.FILE_NAME);
    return path.resolve(__dirname, UrlsManager.FILE_NAME);
  }

  static async ensureUrlsFile(): Promise<string> {
    const filePath = UrlsManager.getUrlsPath();
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      await fs.writeFile(filePath, "", "utf8");
      console.log(chalk.gray(`Created empty file ${UrlsManager.FILE_NAME}`));
    }
    return filePath;
  }

  private static async readUrls(): Promise<string[]> {
    const filePath = await UrlsManager.ensureUrlsFile();
    const raw = await fs.readFile(filePath, "utf8");
    const urls = raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    urls.push("Exit");
    return urls;
  }

  private static async writeUrls(urls: string[]): Promise<string[]> {
    const filePath = await UrlsManager.ensureUrlsFile();
    const unique = Array.from(new Set(urls.map((s) => s.trim()))).filter(Boolean);
    await fs.writeFile(filePath, unique.join("\n") + (unique.length ? "\n" : ""), "utf8");
    return unique;
  }

  private static isValidHTTPUrl(value: string): boolean {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  // ---------- Operations ----------
  static async list(): Promise<void> {
    const urls = await UrlsManager.readUrls();
    if (urls.length === 0) {
      console.log(chalk.yellow("Empty file. Add the first URL."));
    } else {
      console.log(chalk.cyan(`\nContent ${UrlsManager.FILE_NAME}:`));
      urls.forEach((u, i) => {
        console.log(chalk.gray(String(i + 1).padStart(2, " ")), u);
      });
      console.log();
    }
  }

  static async select(): Promise<string> {
    const urls = await UrlsManager.readUrls();
    if (urls.length === 0) {
      console.log(chalk.yellow("Empty file. Add the first URL."));
      return "";
    }
    console.log(chalk.cyan(`\nContent ${UrlsManager.FILE_NAME}:`));
    urls.forEach((u, i) => {
      console.log(chalk.gray(String(i + 1).padStart(2, " ")), u);
    });
    const index = await chalkSelect({
      message: "Choose a URL",
      options: urls.map((u, i) => ({ label: u, value: String(i) })),
    });
    return urls[Number(index)];
  }

  static async add(): Promise<void> {
    let clipboard = await ClipboardManager.read();
    if (clipboard.endsWith("/")) {
      clipboard = clipboard.slice(0, -1);
    }
    console.log(chalk.yellow("Clipboard content: "), chalk.gray(clipboard || "<empty>"));
    const input = await chalkInput({
      message: "Enter (y) to paste url from clipboard, or insert manually: ",
      placeholder: "",
      initialValue: "",
      validate: (value) => (value !== "y" && value !== "n" ? "Введите 'y' или 'n'" : ""),
    });

    if (input === "y") {
      if (UrlsManager.isValidHTTPUrl(clipboard)) {
        const urls = await UrlsManager.readUrls();
        urls.push(clipboard.trim());
        await UrlsManager.writeUrls(urls);
        console.log(chalk.green(`Added ${clipboard}!`));
        await UrlsManager.list();
      } else {
        console.log(chalk.red("Clipboard does not contain a valid http(s) URL."));
      }
    } else {
      const url = await chalkInput({
        message: "Введите URL (http/https): ",
        placeholder: "https://example.com",
        initialValue: "http",
        validate: (value) =>
          UrlsManager.isValidHTTPUrl(value) ? "" : "Required a valid http(s) URL",
      });
      const urls = await UrlsManager.readUrls();
      urls.push(url.trim());
      await UrlsManager.writeUrls(urls);
      console.log(chalk.green(`Added ${url}!`));
      await UrlsManager.list();
    }
  }

  static async edit(): Promise<void> {
    const urls = await UrlsManager.readUrls();
    if (urls.length === 0) {
      console.log(chalk.yellow("Nothing to edit — file is empty."));
      return;
    }

    const index = await chalkSelect({
      message: "Choose a URL to edit",
      options: urls.map((u, i) => ({ label: u, value: String(i) })),
    });
    const numberIndex = Number(index);
    const oldVal = urls[numberIndex];

    const updated = await chalkInput({
      message: "Edit the URL:",
      placeholder: oldVal,
      initialValue: oldVal,
      validate: (value) =>
        UrlsManager.isValidHTTPUrl(value) ? "" : "Required a valid http(s) URL",
    });

    urls[numberIndex] = updated.trim();
    await UrlsManager.writeUrls(urls);
    console.log(chalk.green("Updated!"));
  }

  static async remove(): Promise<void> {
    const urls = await UrlsManager.readUrls();
    if (urls.length === 0) {
      console.log(chalk.yellow("Nothing to remove — file is empty."));
      return;
    }

    const indexes = await chalkMultiSelect({
      message: "Choose URLs to remove",
      options: urls.map((u, i) => ({ label: u, value: String(i) })),
    });

    const toRemove = indexes.map((s) => Number(s));
    const keep = urls.filter((_, i) => !toRemove.includes(i));
    await UrlsManager.writeUrls(keep);
    console.log(chalk.green(`Deleted: ${toRemove.length}`));
    await UrlsManager.list();
  }

  static async clear(): Promise<void> {
    const { ok } = await prompt<{ ok: boolean }>({
      type: "confirm",
      name: "ok",
      message: `Are you sure you want to clear ${UrlsManager.FILE_NAME}?`,
    });

    if (ok) {
      await UrlsManager.writeUrls([]);
      console.log(chalk.green("File cleared!"));
    } else {
      console.log(chalk.gray("Cancelled."));
    }
  }
}

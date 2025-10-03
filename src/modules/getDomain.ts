// src/utils/UrlsManager.ts
import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import pkg from "enquirer";

import chalkSelect from "../utils/chalkSelect.js";
import chalkMultiSelect from "../utils/chalkMultiSelect.js";
import chalkInput from "../utils/chalkInput.js";
import ClipboardManager from "../utils/clipboardManager.js";

const { prompt } = pkg;

export default class UrlsManager {
  static FILE_NAME = "urls.txt";

  // ---------- Helpers ----------
  private static getUrlsPath(): string {
    return path.resolve(process.cwd(), UrlsManager.FILE_NAME);
  }

  static async ensureUrlsFile(): Promise<string> {
    const filePath = UrlsManager.getUrlsPath();
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      await fs.writeFile(filePath, "", "utf8");
      console.log(chalk.gray(`Создан пустой файл ${UrlsManager.FILE_NAME}`));
    }
    return filePath;
  }

  private static async readUrls(): Promise<string[]> {
    const filePath = await UrlsManager.ensureUrlsFile();
    const raw = await fs.readFile(filePath, "utf8");
    return raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  private static async writeUrls(urls: string[]): Promise<string[]> {
    const filePath = await UrlsManager.ensureUrlsFile();
    const unique = Array.from(new Set(urls.map((s) => s.trim()))).filter(Boolean);
    await fs.writeFile(
      filePath,
      unique.join("\n") + (unique.length ? "\n" : ""),
      "utf8"
    );
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
      console.log(chalk.yellow("Файл пуст. Добавьте первую ссылку."));
    } else {
      console.log(chalk.cyan(`\nСодержимое ${UrlsManager.FILE_NAME}:`));
      urls.forEach((u, i) => {
        console.log(chalk.gray(String(i + 1).padStart(2, " ")), u);
      });
      console.log();
    }
  }

  static async select(): Promise<string> {
    const urls = await UrlsManager.readUrls();
    if (urls.length === 0) {
      console.log(chalk.yellow("Файл пуст. Добавьте первую ссылку."));
      return "";
    }
    console.log(chalk.cyan(`\nСодержимое ${UrlsManager.FILE_NAME}:`));
    urls.forEach((u, i) => {
      console.log(chalk.gray(String(i + 1).padStart(2, " ")), u);
    });
    const index = await chalkSelect({
      message: "Выберите URL",
      options: urls.map((u, i) => ({ label: u, value: String(i) })),
    });
    return urls[Number(index)];
  }

  static async add(): Promise<void> {
    const input = await chalkInput({
      message: "Ввести url или вставить из буфера обмена, y/n?: ",
      placeholder: "",
      initialValue: "",
      validate: (value) =>
        value !== "y" && value !== "n" ? "Введите 'y' или 'n'" : "",
    });

    if (input === "y") {
      const clipboard = await ClipboardManager.read();
      if (UrlsManager.isValidHTTPUrl(clipboard)) {
        const urls = await UrlsManager.readUrls();
        urls.push(clipboard.trim());
        await UrlsManager.writeUrls(urls);
        console.log(chalk.green("Добавлено!"));
        await UrlsManager.list();
      } else {
        console.log(chalk.red("Буфер обмена не содержит корректный http(s) URL."));
      }
    } else {
      const url = await chalkInput({
        message: "Введите URL (http/https): ",
        placeholder: "https://example.com",
        initialValue: "http",
        validate: (value) =>
          UrlsManager.isValidHTTPUrl(value)
            ? ""
            : "Нужен корректный http(s) URL",
      });
      const urls = await UrlsManager.readUrls();
      urls.push(url.trim());
      await UrlsManager.writeUrls(urls);
      console.log(chalk.green("Добавлено!"));
      await UrlsManager.list();
    }
  }

  static async edit(): Promise<void> {
    const urls = await UrlsManager.readUrls();
    if (urls.length === 0) {
      console.log(chalk.yellow("Редактировать нечего — файл пуст."));
      return;
    }

    const index = await chalkSelect({
      message: "Выберите URL для редактирования",
      options: urls.map((u, i) => ({ label: u, value: String(i) })),
    });
    const numberIndex = Number(index);
    const oldVal = urls[numberIndex];

    const updated = await chalkInput({
      message: "Отредактируйте URL:",
      placeholder: oldVal,
      initialValue: oldVal,
      validate: (value) =>
        UrlsManager.isValidHTTPUrl(value)
          ? ""
          : "Нужен корректный http(s) URL",
    });

    urls[numberIndex] = updated.trim();
    await UrlsManager.writeUrls(urls);
    console.log(chalk.green("Обновлено!"));
  }

  static async remove(): Promise<void> {
    const urls = await UrlsManager.readUrls();
    if (urls.length === 0) {
      console.log(chalk.yellow("Удалять нечего — файл пуст."));
      return;
    }

    const indexes = await chalkMultiSelect({
      message: "Выберите URL для удаления",
      options: urls.map((u, i) => ({ label: u, value: String(i) })),
    });

    const toRemove = indexes.map((s) => Number(s));
    const keep = urls.filter((_, i) => !toRemove.includes(i));
    await UrlsManager.writeUrls(keep);
    console.log(chalk.green(`Удалено: ${toRemove.length}`));
    await UrlsManager.list();
  }

  static async clear(): Promise<void> {
    const { ok } = await prompt<{ ok: boolean }>({
      type: "confirm",
      name: "ok",
      message: `Очистить ${UrlsManager.FILE_NAME}? Это удалит все ссылки.`,
    });

    if (ok) {
      await UrlsManager.writeUrls([]);
      console.log(chalk.green("Файл очищен."));
    } else {
      console.log(chalk.gray("Отменено."));
    }
  }
}

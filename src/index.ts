#!/usr/bin/env node

import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
// import { prompt } from "enquirer";
import pkg from 'enquirer';
const { prompt } = pkg;

// ---------- Константы ----------
const FILE_NAME = "urls.txt";

// Путь к urls.txt именно в ТЕКУЩЕЙ директории запуска
function getUrlsPath(): string {
  return path.resolve(process.cwd(), FILE_NAME);
}

// Проверить существование или создать пустой файл
async function ensureUrlsFile(): Promise<string> {
  const filePath = getUrlsPath();
  const exists = await fs.pathExists(filePath);
  if (!exists) {
    await fs.writeFile(filePath, "", "utf8");
    console.log(chalk.gray(`Создан пустой файл ${FILE_NAME}`));
  }
  return filePath;
}

// Прочитать файл -> массив строк-URL
async function readUrls(): Promise<string[]> {
  const filePath = await ensureUrlsFile();
  const raw = await fs.readFile(filePath, "utf8");
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Записать массив URL (уникализируем + финальный перевод строки)
async function writeUrls(urls: string[]): Promise<string[]> {
  const filePath = await ensureUrlsFile();
  const unique = Array.from(new Set(urls.map((s) => s.trim()))).filter(Boolean);
  await fs.writeFile(filePath, unique.join("\n") + (unique.length ? "\n" : ""), "utf8");
  return unique;
}

// Валидация URL (http/https)
function isValidHTTPUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// ---------- Операции ----------
async function listUrls(): Promise<void> {
  const urls = await readUrls();
  if (urls.length === 0) {
    console.log(chalk.yellow("Файл пуст. Добавьте первую ссылку."));
  } else {
    console.log(chalk.cyan(`\nСодержимое ${FILE_NAME}:`));
    urls.forEach((u, i) => {
      console.log(chalk.gray(String(i + 1).padStart(2, " ")), u);
    });
    console.log();
  }
}

async function addUrl(): Promise<void> {
  const { url } = await prompt<{ url: string }>({
    type: "input",
    name: "url",
    message: "Введите URL (http/https)",
    validate: (val: string) => (isValidHTTPUrl(val) ? true : "Нужен корректный http(s) URL"),
  });

  const urls = await readUrls();
  urls.push(url.trim());
  await writeUrls(urls);
  console.log(chalk.green("Добавлено!"));
}

async function editUrl(): Promise<void> {
  const urls = await readUrls();
  if (urls.length === 0) {
    console.log(chalk.yellow("Редактировать нечего — файл пуст."));
    return;
  }

  const { index } = await prompt<{ index: number }>({
    type: "select",
    name: "index",
    message: "Выберите ссылку для редактирования",
    choices: urls.map((u, i) => ({ name: String(i), message: u, value: i })),
  });

  const oldVal = urls[index];

  const { updated } = await prompt<{ updated: string }>({
    type: "input",
    name: "updated",
    message: "Новый URL",
    initial: oldVal,
    validate: (val: string) => (isValidHTTPUrl(val) ? true : "Нужен корректный http(s) URL"),
  });

  urls[index] = updated.trim();
  await writeUrls(urls);
  console.log(chalk.green("Обновлено!"));
}

async function removeUrls(): Promise<void> {
  const urls = await readUrls();
  if (urls.length === 0) {
    console.log(chalk.yellow("Удалять нечего — файл пуст."));
    return;
  }

  const { toRemove } = await prompt<{ toRemove: number[] }>({
    type: "multiselect",
    name: "toRemove",
    message: "Выберите ссылки для удаления (пробел — выбрать, Enter — подтвердить)",
    choices: urls.map((u, i) => ({ name: String(i), message: u, value: i })),
    // можно убрать required, чтобы позволить пустой выбор
    required: false as any,
  });

  if (!toRemove || toRemove.length === 0) {
    console.log(chalk.gray("Ничего не выбрано."));
    return;
  }

  const keep = urls.filter((_, i) => !toRemove.includes(i));
  await writeUrls(keep);
  console.log(chalk.green(`Удалено: ${toRemove.length}`));
}

async function clearFile(): Promise<void> {
  const { ok } = await prompt<{ ok: boolean }>({
    type: "confirm",
    name: "ok",
    message: `Очистить ${FILE_NAME}? Это удалит все ссылки.`,
  });

  if (ok) {
    await writeUrls([]);
    console.log(chalk.green("Файл очищен."));
  } else {
    console.log(chalk.gray("Отменено."));
  }
}

// ---------- Главное меню ----------
async function mainMenu(): Promise<void> {
  await ensureUrlsFile();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { action } = await prompt<{
      action: "list" | "add" | "edit" | "remove" | "clear" | "exit";
    }>({
      type: "select",
      name: "action",
      message: `Меню (${FILE_NAME} в текущей папке)`,
      choices: [
        { name: "list", message: "Просмотреть ссылки", value: "list" },
        { name: "add", message: "Добавить ссылку", value: "add" },
        { name: "edit", message: "Редактировать ссылку", value: "edit" },
        { name: "remove", message: "Удалить одну/несколько ссылок", value: "remove" },
        { name: "clear", message: "Очистить файл", value: "clear" },
        { name: "exit", message: "Выход", value: "exit" },
      ],
    });

    try {
      if (action === "list") await listUrls();
      else if (action === "add") await addUrl();
      else if (action === "edit") await editUrl();
      else if (action === "remove") await removeUrls();
      else if (action === "clear") await clearFile();
      else if (action === "exit") break;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(chalk.red("Ошибка:"), msg);
    }
  }
}

// Старт
mainMenu();

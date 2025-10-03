import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
// import { prompt } from "enquirer";
import pkg from "enquirer";
import chalkSelect from "../utils/chalkSelect.js";
import chalkMultiSelect from "../utils/chalkMultiSelect.js";
import chalkInput from "../utils/chalkInput.js";
import ClipboardManager from "../utils/clipboardManager.js";

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

async function selectUrl(): Promise<string> {
  const urls = await readUrls();
  if (urls.length === 0) {
    console.log(chalk.yellow("Файл пуст. Добавьте первую ссылку."));
  } else {
    console.log(chalk.cyan(`\nСодержимое ${FILE_NAME}:`));
    urls.forEach((u, i) => {
      console.log(chalk.gray(String(i + 1).padStart(2, " ")), u);
    });
  }
}

async function addUrl(): Promise<void> {
  const input = await chalkInput({
    message: "Ввести url или вставить из буфера обмена, y/n?: ",
    placeholder: "",
    initialValue: "",
    validate: (value) => {
      if (value !== "y" && value !== "n") {
        return "Введите 'y' или 'n'";
      }
    },
  });

  if (input === "y") {
    const clipboard = await ClipboardManager.read();
    if (isValidHTTPUrl(clipboard)) {
      const urls = await readUrls();
      urls.push(clipboard.trim());
      await writeUrls(urls);
      console.log(chalk.green("Добавлено!"));
      await listUrls();
    } else {
      console.log(chalk.red("Буфер обмена не содержит корректный http(s) URL."));
    }
  } else {
    const url = await chalkInput({
      message: "Введите URL (http/https): ",
      placeholder: "https://example.com",
      initialValue: "http",
      validate: (value) => (isValidHTTPUrl(value) ? "" : "Нужен корректный http(s) URL"),
    });
    const urls = await readUrls();
    urls.push(url.trim());
    await writeUrls(urls);
    console.log(chalk.green("Добавлено!"));
    await listUrls();
  }
}

async function editUrl(): Promise<void> {
  const urls = await readUrls();
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
    validate: (value) => (isValidHTTPUrl(value) ? "" : "Нужен корректный http(s) URL"),
  });

  urls[numberIndex] = updated.trim();
  await writeUrls(urls);
  console.log(chalk.green("Обновлено!"));
}

async function removeUrls(): Promise<void> {
  const urls = await readUrls();
  if (urls.length === 0) {
    console.log(chalk.yellow("Удалять нечего — файл пуст."));
    return;
  }

  const message = "Выберите файл для удаления";
  const options = urls.map((u, i) => ({ label: u, value: String(i) }));
  const indexes = await chalkMultiSelect({ message, options });

  const toRemove = indexes.map((s) => Number(s));
  const keep = urls.filter((_, i) => !toRemove.includes(i));
  await writeUrls(keep);
  console.log(chalk.green(`Удалено: ${toRemove.length}`));
  await listUrls();
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

export {
  ensureUrlsFile,
  readUrls,
  writeUrls,
  listUrls,
  addUrl,
  editUrl,
  removeUrls,
  clearFile,
  FILE_NAME,
};

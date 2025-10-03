import { addUrl, clearFile, editUrl, ensureUrlsFile, FILE_NAME, listUrls, removeUrls } from "./getDomain.js";
import chalk from "chalk";
import pkg from "enquirer";
const { prompt } = pkg;
export default async function mainMenu() {
    await ensureUrlsFile();
    while (true) {
        const { action } = await prompt({
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
            if (action === "list")
                await listUrls();
            else if (action === "add")
                await addUrl();
            else if (action === "edit")
                await editUrl();
            else if (action === "remove")
                await removeUrls();
            else if (action === "clear")
                await clearFile();
            else if (action === "exit")
                break;
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.error(chalk.red("Ошибка:"), msg);
        }
    }
}

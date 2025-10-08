import chalkMultiSelect from "../utils/chalkMultiSelect.js";

export type TIdsSubMenu = "all" | "duplicates" | "back" | "exit";

export default async function getIdsSubMenu(): Promise<TIdsSubMenu[]> {
  const res = await chalkMultiSelect({
    message: "Select ids options (use space to select, enter to confirm):",
    options: [
      { label: "All", value: "all" },
      { label: "Duplicates", value: "duplicates" },
      { label: "Back", value: "back" },
      { label: "Exit", value: "exit" },
    ],
  });
  return res as TIdsSubMenu[];
}

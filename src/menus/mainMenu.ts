import Select from "../classes/Select.js";
import {TMainMenuValues} from "../types/TMainMenuValues.js";
import { TOption } from "../types/TOption.js";

export default async function mainMenu(): Promise<TMainMenuValues[]> {
  const message = "Select an option:";
  const menu_options = [
    { label: "1.Seo all", value: "seo_all" },
    { label: "2.Seo missing", value: "seo_missing" },
    { label: "3.Images alt missing", value: "missing_alt" },
    { label: "4.Links empty", value: "links_empty" },
    { label: "5.Links hash", value: "links_hash" },
    { label: "6.Links broken hash", value: "links_broken_hash" },
    { label: "7.Ids duplicates", value: "ids_duplicates" },
    { label: "8.Exit", value: "exit" },
  ] as const satisfies readonly TOption[];

  return Select.selectMultiple(message, menu_options);
}

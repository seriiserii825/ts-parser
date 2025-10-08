import Select from "../classes/Select.js";
import { TOption } from "../types/TOption.js";
import xmlMenu from "./xmlMenu.js";

export default async function getUrlLinks(current_url: string): Promise<string[]> {
  const options = [
    { label: "1.Choose sitemap Links", value: "sitemap" },
    { label: "2.Choose current url", value: "current_url" },
  ] as const satisfies readonly TOption[];
  const action = Select.selectOne("Choose option", options);
  if (action === "sitemap") {
    return await xmlMenu(current_url);
  } else {
    return [current_url];
  }
}

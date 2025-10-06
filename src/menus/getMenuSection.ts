import {select} from "@clack/prompts";
import {TSection} from "../types/TSection.js";


export default async function getMenuSection() {
  const section = (await select({
    message: "What to extract (applies to ALL passed URLs)?",
    options: [
      { label: "SEO", value: "seo" },
      { label: "Images", value: "images" },
      { label: "Links", value: "links" },
      { label: "Exit", value: "exit" },
    ] as const,
  })) as TSection | symbol;
  return section;
}

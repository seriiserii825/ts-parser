import chalk from "chalk";
import XmlParse from "../classes/XmlParse.js";
import chalkSelect from "../utils/chalkSelect.js";
import chalkMultiSelect from "../utils/chalkMultiSelect.js";

export default async function xmlMenu(url: string): Promise<string[]> {
  const parser = new XmlParse();
  const links = await getSitemapLinks(parser, url);
  if (!links) return [];
  const choice = await chooseALink(links);
  if (!choice) return [];
  const collection = await getCollectionFromLink(parser, choice);
  if (collection.length === 0) return [];
  const links_to_parse = await getLinksToParse(collection);
  if (links_to_parse.length === 0) return [];
  return links_to_parse;
}

async function getSitemapLinks(parser: XmlParse, url: string): Promise<string[] | undefined> {
  const xml_link = `${url}/sitemap_index.xml`;
  const links = await parser.parseLocLinks(xml_link);
  if (links.length === 0) {
    console.log(chalk.red("No sitemap links found. Exiting..."));
    return;
  }
  return links;
}

async function chooseALink(links: string[]): Promise<string | undefined> {
  const options = links.map((link) => ({ label: link, value: link }));
  const choice = await chalkSelect({
    message: "Select a sitemap link:",
    options,
  });
  if (!choice) {
    console.log(chalk.red("No link selected. Exiting..."));
    return;
  }
  return choice;
}

async function getCollectionFromLink(parser: XmlParse, link: string): Promise<string[]> {
  const collection = await parser.parseLocLinks(link);
  if (collection.length === 0) {
    console.log(chalk.red("No URLs found in the selected sitemap. Exiting..."));
    return [];
  }
  return collection;
}

async function getLinksToParse(links: string[]): Promise<string[]> {
  const allOption = { value: "__all__", label: "✅ Select all" };
  const choices = await chalkMultiSelect({
    message: "Select links to parse (use space to select multiple):",
    options: [allOption, ...links.map((link) => ({ label: link, value: link }))],
  });
  if (!choices || choices.length === 0) {
    console.log(chalk.red("No links selected. Exiting..."));
    return [];
  }
  if (choices.includes(allOption.value)) {
    return links;
  }
  return choices;
}

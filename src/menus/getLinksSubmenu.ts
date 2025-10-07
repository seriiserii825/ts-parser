import htmlMenu from "./htmlMenu.js";

export default async function getLinksSubMenu() {
  const res = await htmlMenu([
    { label: "All", value: "all" },
    { label: "Empty", value: "empty" },
    { label: "With hash", value: "hash" },
    { label: "Back", value: "back" },
    { label: "Exit", value: "exit" },
  ]);
  return res;
}

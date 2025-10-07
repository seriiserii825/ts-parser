import htmlMenu from "./htmlMenu.js";

export default async function getIdsSubMenu() {
  const res = await htmlMenu([
    { label: "All", value: "all" },
    { label: "Back", value: "back" },
    { label: "Exit", value: "exit" },
  ]);
  return res;
}

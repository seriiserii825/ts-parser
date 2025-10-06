import htmlMenu from "./htmlMenu.js";

export default async function getImagesSubMenu() {
  const res = await htmlMenu([
    { label: "All", value: "all" },
    { label: "With alt", value: "alt" },
    { label: "Without alt", value: "no-alt" },
    { label: 'With loading="lazy"', value: "lazy" },
    { label: "Without loading attribute", value: "no-loading" },
    { label: "Back", value: "back" },
    { label: "Exit", value: "exit" },
  ]);
  return res;
}

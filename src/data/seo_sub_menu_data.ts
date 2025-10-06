// 1) Declare menu as a const tuple so its values stay literal
export const menu: TSeoSubMenuItem[] = [
  { label: "All", value: "all" },
  { label: "Title", value: "title" },
  { label: "Description", value: "description" },
  { label: "Og Image", value: "og_image" },
  { label: "Robots", value: "robots" },
  { label: "Missing", value: "missing" },
  { label: "Back", value: "back" },
  { label: "Exit", value: "exit" },
];

// 2) Infer the union type from the tuple
export type TSeoSubMenu =
  | "all"
  | "title"
  | "description"
  | "og_image"
  | "robots"
  | "missing"
  | "back"
  | "exit";

// 3) Use that type where needed
export type TSeoSubMenuItem = { label: string; value: TSeoSubMenu };
export const seo_sub_menu_data: TSeoSubMenuItem[] = menu;

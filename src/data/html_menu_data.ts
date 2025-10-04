type THtmlMenuItem = {
  label: string;
  value: THtmlMenuValue;
};

export type THtmlMenuValue = "seo" | "images" | "links" | "exit";

export const html_menu_data: THtmlMenuItem[] = [
  { label: "SEO", value: "seo" },
  { label: "Images", value: "images" },
  { label: "Links", value: "links" },
  { label: "Exit", value: "exit" },
];

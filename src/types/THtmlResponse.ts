export type TSeoInfo = {
  title: string | null;
  description: string | null;
  ogImage: string | null;
  robots: string | null;
};

export type TLinkInfo = {
  url: string;
  text: string;
  rel?: string;
  target?: string;
  external: boolean;
  nofollow: boolean;
  parent_class: string;
};

export type TImageInfo = {
  url: string;
  name: string;
  alt?: string;
  loading?: string;
  parent_class: string;
};

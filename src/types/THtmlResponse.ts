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
};

export type TImageInfo = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: string;
};

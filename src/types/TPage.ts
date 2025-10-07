import {TImageInfo, TLinkInfo, TSeoInfo} from "./THtmlResponse.js";

export type TPage = {
  url: string;
  seo?: TSeoInfo;
  images?: TImageInfo[];
  links?: TLinkInfo[];
};

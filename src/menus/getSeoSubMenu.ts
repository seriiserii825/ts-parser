import {seo_sub_menu_data, TSeoSubMenu} from "../data/seo_sub_menu_data.js";
import chalkMultiSelect from "../utils/chalkMultiSelect.js";

export default async function getSeoSubMenu(){
      const res = await chalkMultiSelect({
        message: "Select SEO options (use space to select multiple):",
        options: seo_sub_menu_data,
      }) as TSeoSubMenu[];
      return res;
}

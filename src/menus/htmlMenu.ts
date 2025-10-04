import {TOption} from "../types/TOption.js";
import chalkMultiSelect from "../utils/chalkMultiSelect.js";

export default async function htmlMenu(options: TOption[]): Promise<string[]> {
  const choices = await chalkMultiSelect({
    message: "Select HTML elements to extract:",
    options,
  });
  return choices;
}

import { multiselect } from "@clack/prompts";

export type MultiSelectInput = {
  message: string;
  options: Array<{ label: string; value: string }>;
};

export default async function chalkMultiSelect(
  data: MultiSelectInput
): Promise<string[]> {
  const result = (await multiselect(data)) as string[] | null;
  return result ?? [];
}

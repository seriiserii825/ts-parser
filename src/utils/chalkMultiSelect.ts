import { multiselect } from "@clack/prompts";

type TOption = { label: string; value: string };

export default async function chalkMultiSelect<
  T extends { message: string; options: Array<TOption> }
>(data: T): Promise<string[]> {
  const result = (await multiselect(data)) as string[] | null;
  if (result === null) {
    return [];
  }
  return result;
}


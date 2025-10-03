import { select } from "@clack/prompts";

type TOption = { label: string; value: string };

export default async function chalkSelect<T extends { message: string; options: Array<TOption> }>(
  data: T
): Promise<string> {
  return String(await select(data));
}

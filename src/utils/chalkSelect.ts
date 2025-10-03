import { select } from "@clack/prompts";
import { TOption } from "../types/TOption.js";

export default async function chalkSelect<T extends { message: string; options: Array<TOption> }>(
  data: T
): Promise<string> {
  return String(await select(data));
}

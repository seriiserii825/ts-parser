// src/utils/tablePrinter.ts
import { Table } from "console-table-printer";
import type { ColumnOptionsRaw } from "console-table-printer/dist/src/models/external-table.js";

type Cell = string | number | boolean | null | undefined;
type ColumnNames<TCols extends readonly ColumnOptionsRaw[]> = TCols[number]["name"];
type RowFor<TCols extends readonly ColumnOptionsRaw[]> =
  Record<ColumnNames<TCols>, Cell> & { [extra: string]: Cell };

export default function tablePrinter<
  const TCols extends readonly ColumnOptionsRaw[]
>({
  columns,
  rows,
}: {
  columns: TCols;
  rows: Array<RowFor<TCols>>;
}): void {
  if (!Array.isArray(columns)) {
    throw new TypeError(`Expected "columns" to be an array, got ${typeof columns}.`);
  }
  const p = new Table({ columns });
  p.addRows(rows);
  p.printTable();
}

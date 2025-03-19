import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterMeta, Row } from "@tanstack/react-table";

export function fuzzyFilter<TData>(
  row: Row<TData>,
  columnId: string,
  value: unknown,
  addMeta: (meta: FilterMeta) => void
) {
  const itemRank = rankItem(row.getValue(columnId), value as string);

  addMeta({ itemRank });

  return itemRank.passed;
}

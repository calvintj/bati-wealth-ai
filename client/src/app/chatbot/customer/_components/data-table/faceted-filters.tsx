import { Table } from "@tanstack/react-table";

import {
  aumLabel,
  customerPrio,
  customerType,
  riskProfile,
  transactionLabel,
} from "@/app/(main)/customer/_data/data";
import { DataTableFacetedFilterProps } from "@/components/ui/data-table/data-table-faceted-filter";
import { Customer } from "@/types/customer-v2";

const getFacetedUniqueValues = (table: Table<Customer>, columnKey: string) => {
  return Array.from(
    table.getColumn(columnKey)?.getFacetedUniqueValues().keys() ?? []
  ).map((option) => ({ label: option, value: option }));
};

export function getFacetedFilters(
  table: Table<Customer>
): DataTableFacetedFilterProps<Customer, unknown>[] {
  return [
    {
      column: table.getColumn("assignedRm"),
      options: getFacetedUniqueValues(table, "assignedRm"),
      title: "Assigned RM",
    },
    {
      column: table.getColumn("customerType"),
      options: customerType,
      title: "Customer Type",
    },
    {
      column: table.getColumn("customerId"),
      options: getFacetedUniqueValues(table, "customerId"),
      title: "Customer ID",
    },
    {
      column: table.getColumn("customerName"),
      options: getFacetedUniqueValues(table, "customerName"),
      title: "Customer Name",
    },
    {
      column: table.getColumn("priorityPrivate"),
      options: customerPrio,
      title: "Priority/Private",
    },
    {
      column: table.getColumn("transactionLabel"),
      options: transactionLabel,
      title: "Transaction Label",
    },
    {
      column: table.getColumn("aumLabel"),
      options: aumLabel,
      title: "AUM Label",
    },
    {
      column: table.getColumn("riskProfile"),
      options: riskProfile,
      title: "Risk Profile",
    },
  ];
}

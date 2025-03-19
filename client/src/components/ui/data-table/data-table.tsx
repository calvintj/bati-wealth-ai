"use client";

import {
  ColumnDef,
  flexRender,
  type Table as TableT,
} from "@tanstack/react-table";

import DataTableActions from "@/components/ui/data-table/data-table-actions";
import { DataTableFacetedFilterProps } from "@/components/ui/data-table/data-table-faceted-filter";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMounted } from "@/components/ui/use-is-mounted";
import { cn } from "@/lib/utils";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  table: TableT<TData>;
  columns: ColumnDef<TData, TValue>[];
  searchColumnKey: keyof TData;
  facetedFilters?: DataTableFacetedFilterProps<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
  searchColumnKey,
  table,
  facetedFilters = [],
}: DataTableProps<TData, TValue>) {
  const isMounted = useIsMounted();

  if (!isMounted) return <Spinner />;

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        searchColumnKey={searchColumnKey}
        facetedFilters={facetedFilters}
        table={table}
      />
      <div>
        <Table className="bg-background">
          <TableHeader className="bg-secondary dark:bg-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="border" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      className={cn(
                        "border active:border-4 active:border-blue-300 dark:active:border-accent active:bg-blue-100 dark:active:bg-accent2 transition-all",
                        i === 0 && "bg-secondary dark:bg-accent text-center",
                        cell.row.getIsSelected() &&
                          "bg-blue-100 border-blue-200 dark:bg-accent2/50 dark:border-accent2/50"
                      )}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
      <DataTableActions table={table} />
    </div>
  );
}

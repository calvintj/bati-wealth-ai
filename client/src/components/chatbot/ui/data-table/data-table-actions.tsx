import { Table } from "@tanstack/react-table";
import React from "react";

import { Button } from "@/components/ui/button";

interface DataTableActionsProps<TData> {
  table: Table<TData>;
}

export default function DataTableActions<TData>({
  table,
}: DataTableActionsProps<TData>) {
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="w-full flex items-center gap-4">
      <Button onClick={table.getToggleAllRowsSelectedHandler()}>
        {selectedRowCount === 0 ? "Select All Data" : "Deselect All Data"}
      </Button>
      {/* <Button variant="destructive">
        <Trash />
        Delete selected {table.getFilteredSelectedRowModel().rows.length} row(s)
      </Button> */}
    </div>
  );
}

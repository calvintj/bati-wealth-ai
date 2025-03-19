"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fuzzyFilter } from "@/lib/fuzzy-filter";
import { Customer } from "@/types/customer-v2";

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="m-auto mr-3 ml-1 block"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        className="m-auto mr-3 ml-1 block"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer ID" />
    ),
    filterFn: (row, id, value) => {
      return value.includes((row.getValue(id) as number).toString());
    },
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
    filterFn: (row, id, value, meta) => {
      if (typeof value === "string") {
        return fuzzyFilter(row, id, value, meta);
      }

      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "assignedRm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned RM" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "customerType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Type" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priorityPrivate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority / Private" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "transactionLabel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Label" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "aumLabel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AUM Label" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "propensityBAC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propensity BAC" />
    ),
  },
  {
    accessorKey: "propensitySB",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propensity SB" />
    ),
  },
  {
    accessorKey: "propensityRD",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propensity RD" />
    ),
  },
  {
    accessorKey: "scoreOverall",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score Overall" />
    ),
  },
  {
    accessorKey: "scoreBAC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score BAC" />
    ),
  },
  {
    accessorKey: "scoreSB",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score SB" />
    ),
  },
  {
    accessorKey: "scoreRD",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score RD" />
    ),
  },
  {
    accessorKey: "riskProfile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Risk Profile" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(customer.customerId.toString())
              }
            >
              Copy Customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update customer</DropdownMenuItem>
            <DropdownMenuItem
              className={buttonVariants({ variant: "destructive" })}
            >
              Delete customer <Trash />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

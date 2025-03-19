"use client";

import { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import React, { useState } from "react";

import {
  DataTableFacetedFilter,
  DataTableFacetedFilterProps,
} from "@/components/ui/data-table/data-table-faceted-filter";

import { Button } from "../button";
import { Input } from "../input";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  searchColumnKey: keyof TData;
  facetedFilters?: DataTableFacetedFilterProps<TData, TValue>[];
}

export function DataTableToolbar<TData, TValue>({
  table,
  searchColumnKey,
  facetedFilters = [],
}: DataTableToolbarProps<TData, TValue>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [input, setInput] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    table.getColumn(searchColumnKey.toString())?.setFilterValue(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const resetFilters = () => {
    table.resetColumnFilters();
    setInput("");
  };

  return (
    <div className="flex flex-col gap-4 justify-center">
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-1 items-center space-x-2 mr-2 justify-between">
          <form className="w-fit flex gap-2" onSubmit={handleSearch}>
            <Input
              placeholder="Search..."
              value={input}
              onChange={handleInputChange}
              className="w-[150px] lg:w-[250px] rounded-md dark:bg-accent"
            />
            <Button size="icon" className="flex-shrink-0 rounded-md">
              <Search />
            </Button>
          </form>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex items-end overflow-x-auto hide-scrollbar gap-2 w-full justify-between">
        {facetedFilters.map((filter) => (
          <DataTableFacetedFilter
            key={filter.title}
            options={filter.options}
            column={filter.column}
            title={filter.title}
          />
        ))}
      </div>
    </div>
  );
}

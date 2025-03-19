"use client";

import { columns } from "@/app/(main)/customer/_components/data-table/column";
import { getFacetedFilters } from "@/app/(main)/customer/_components/data-table/faceted-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useGetCustomer } from "@/hooks/api/customer-api";
import { useTanstackTable } from "@/hooks/use-tanstack-table";

export default function CustomerTable() {
  const { data } = useGetCustomer({ limit: 10000, page: 1 });

  const table = useTanstackTable({
    data: data?.data ?? [],
    columns,
  });

  const facetedFilters = getFacetedFilters(table);

  return (
    <div className="py-4 w-full">
      <DataTable
        searchColumnKey="customerName"
        table={table}
        columns={columns}
        facetedFilters={facetedFilters}
      />
    </div>
  );
}

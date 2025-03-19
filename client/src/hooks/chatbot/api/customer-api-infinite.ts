"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/lib/query-key";
import { CustomerService } from "@/services/chatbot/customer-service";
import { PaginatedOptions } from "@/types/paginated-options";

export const useGetCustomersInfinite = (options: PaginatedOptions) => {
  const customerService = new CustomerService();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.customerId, "infinite"],
    queryFn: ({ pageParam }) => customerService.getAllCustomer(pageParam),
    getNextPageParam: (lastPage) => ({
      limit: lastPage.meta.itemsPerPage,
      page: lastPage.meta.currentPage + 1,
    }),
    getPreviousPageParam: (firstPage) => ({
      limit: firstPage.meta.itemsPerPage,
      page: firstPage.meta.currentPage - 1,
    }),
    initialPageParam: options,
  });
};

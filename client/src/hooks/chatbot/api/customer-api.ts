"use client";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/lib/query-key";
import { CustomerService } from "@/services/customer-service";
import { PaginatedOptions } from "@/types/paginated-options";

export const useGetCustomer = (options: PaginatedOptions) => {
  const customerService = new CustomerService();

  return useQuery({
    queryFn: () => customerService.getAllCustomer(options),
    queryKey: [...QUERY_KEY.customer, options],
  });
};

export const useGetCustomerById = (id: string) => {
  const customerService = new CustomerService();

  return useQuery({
    queryFn: () => customerService.getCustomer(id),
    queryKey: [...QUERY_KEY.customer, id],
  });
};

export const useGetCustomerId = (options: PaginatedOptions) => {
  const customerService = new CustomerService();

  return useQuery({
    queryFn: () => customerService.getAllCustomerId(options),
    queryKey: [...QUERY_KEY.customerId(), options],
  });
};

export const useGetCustomerName = (options: PaginatedOptions) => {
  const customerService = new CustomerService();

  return useQuery({
    queryFn: () => customerService.getAllCustomerName(options),
    queryKey: [...QUERY_KEY.customerName(), options],
  });
};

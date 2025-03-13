import { useState, useEffect } from "react";
import fetchCustomerList from "../../services/customer-list/customer-list-api";
import { Customer } from "@/types/customer-list";

export function useCustomerList() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomerList(setCustomerList);
  }, []);

  return customerList;
}

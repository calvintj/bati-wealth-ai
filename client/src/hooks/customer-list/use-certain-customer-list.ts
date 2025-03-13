import { useState, useEffect } from "react";
import fetchCertainCustomerList from "../../services/customer-list/certain-customer-list-api";
import { Customer } from "@/types/customer-list";

export function useCertainCustomerList(propensity: string, aum: string) {
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCertainCustomerList(setCustomerList, propensity, aum);
  }, [propensity, aum]);

  return customerList;
}

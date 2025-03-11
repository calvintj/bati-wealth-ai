import { useState, useEffect } from "react";
import fetchCustomerList from "../../services/customer-list/customer-list-api";

export function useCustomerList() {
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    fetchCustomerList(setCustomerList);
  }, []);

  return customerList;
}

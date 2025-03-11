import { useState, useEffect } from "react";
import fetchCertainCustomerList from "../../services/customer-list/certain-customer-list-api";

export function useCertainCustomerList(propensity, aum) {
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    fetchCertainCustomerList(setCustomerList, propensity, aum);
  }, [propensity, aum]);

  return customerList;
}

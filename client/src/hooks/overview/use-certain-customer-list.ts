import { useState, useEffect } from "react";
import fetchCertainCustomerList from "../../services/overview/customer-list-api";

export function useCertainCustomerList(customerRisk) {
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    // Map the customerRisk to the format expected by the backend
    let formattedRisk;
    switch (customerRisk) {
      case "Conservative":
        formattedRisk = "1 - Conservative";
        break;
      case "Balanced":
        formattedRisk = "2 - Balanced";
        break;
      case "Moderate":
        formattedRisk = "3 - Moderate";
        break;
      case "Growth":
        formattedRisk = "4 - Growth";
        break;
      case "Aggressive":
        formattedRisk = "5 - Aggressive";
        break;
      default:
        formattedRisk = customerRisk;
    }

    // Only fetch if we have a valid risk profile
    if (customerRisk !== "All") {
      fetchCertainCustomerList(setCustomerList, formattedRisk);
    }
  }, [customerRisk]);

  return customerList;
}

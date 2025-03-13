import { useState, useEffect } from "react";
import fetchCustomerDetails from "../../services/customer-details/customer-details-api";

interface CustomerDetails {
    Priority_Private: string;
    Usia: string;
    Status_Nikah: string;
    Risk_Profile: string;
    Vintage: string;
}

export function useCustomerDetails(customerID: string) {
  const [data, setData] = useState<CustomerDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails(customerID)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customer details:", err);
        setLoading(false);
      });
  }, [customerID]);

  return { data, loading };
}

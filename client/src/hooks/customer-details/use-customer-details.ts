import { useState, useEffect } from "react";
import fetchCustomerDetails from "../../services/customer-details/customer-details-api";

export function useCustomerDetails(customerID) {
  const [data, setData] = useState([]);
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

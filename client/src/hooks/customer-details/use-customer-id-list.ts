// hooks/customerDetails-hook/customerDetails.js
import { useState, useEffect } from "react";
import fetchCustomerIDList from "../../services/customer-details/customer-id-list-api";

export function useCustomerIDList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerIDList()
      // Fetch customer details
      .then((customers) => {
        setData(customers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customer list:", err);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}

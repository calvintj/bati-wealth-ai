export const QUERY_KEY = {
  customer: ["CUSTOMER"] as const,
  customerName: () => [...QUERY_KEY.customer, "NAME"],
  customerId: () => [...QUERY_KEY.customer, "ID"],
};

import { Constants } from "@/consts/constants";
import { Customer } from "@/types/customer-v2";
import { PaginatedResponse } from "@/types/paginated-response";

export const getTableData = async (): Promise<PaginatedResponse<Customer>> => {
  const response = await fetch(Constants.BASE_CLIENT_URL + "/api/v1/customers");

  return await response.json();
};

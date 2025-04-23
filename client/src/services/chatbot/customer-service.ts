import { Service } from "@/services/chatbot";
import type { ApiResponse } from "@/types/api-response";
import { Customer } from "@/types/customer-v2";
import { PaginatedOptions } from "@/types/paginated-options";
import { PaginatedResponse } from "@/types/paginated-response";

export class CustomerService extends Service {
  async getAllCustomer(
    options: PaginatedOptions
  ): Promise<PaginatedResponse<Customer>> {
    const searchParams = this.getSearchParams(options);
    const response = await fetch(
      "/api/v2/customers" + `?${searchParams.toString()}`
    );
    const json = await response.json();

    if (!response.ok) throw new Error(json?.message ?? "Something went wrong");

    return json;
  }

  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    const response = await fetch(`/api/v2/customers/${id}`);
    const json = await response.json();

    if (!response.ok) throw new Error(json?.message ?? "Something went wrong");

    return json;
  }

  async getAllCustomerName(options: PaginatedOptions): Promise<string[]> {
    const customers = await this.getAllCustomer(options);
    return customers?.data?.map((data) => data.customerName);
  }

  async getAllCustomerId(options: PaginatedOptions): Promise<number[]> {
    const customers = await this.getAllCustomer(options);
    return customers?.data?.map((data) => data.customerId);
  }
}

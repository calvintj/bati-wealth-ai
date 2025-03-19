import { ApiResponse } from "@/types/api-response";

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsCount: number;
  };
  links: {
    first: string;
    previous: string | null;
    current: string;
    next: string | null;
    last: string;
  };
}

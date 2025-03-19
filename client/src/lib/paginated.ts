import { PaginatedResponse } from "./../types/paginated-response";

export class Paginated<T> implements PaginatedResponse<T> {
  data: T[];
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

  private constructor(
    data: T[],
    meta: {
      itemsPerPage: number;
      totalItems: number;
      currentPage: number;
      totalPages: number;
      itemsCount: number;
    },
    links: {
      first: string;
      previous: string | null;
      current: string;
      next: string | null;
      last: string;
    }
  ) {
    this.data = data;
    this.meta = meta;
    this.links = links;
  }

  static paginate<T>(
    array: T[],
    page: number = 1,
    limit: number = 10,
    baseUrl: string
  ): Paginated<T> {
    const totalItems = array.length;
    const totalPages = Math.ceil(totalItems / limit);

    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const paginatedData = array.slice(startIndex, startIndex + limit);

    const createUrl = (pageNumber: number): string => {
      const url = new URL(baseUrl);
      url.searchParams.set("page", pageNumber.toString());
      url.searchParams.set("limit", limit.toString());
      return url.toString();
    };

    const links = {
      first: createUrl(1),
      previous: currentPage > 1 ? createUrl(currentPage - 1) : null,
      current: createUrl(currentPage),
      next: currentPage < totalPages ? createUrl(currentPage + 1) : null,
      last: createUrl(totalPages),
    };

    const meta = {
      itemsPerPage: limit,
      totalItems,
      currentPage,
      totalPages,
      itemsCount: paginatedData.length,
    };

    return new Paginated<T>(paginatedData, meta, links);
  }

  static paginateByTotalRecords<T>(
    data: T[],
    totalRecords: number,
    page: number = 1,
    limit: number = 10,
    baseUrl: string
  ): Paginated<T> {
    const totalPages = Math.ceil(totalRecords / limit);

    const currentPage = Math.max(1, Math.min(page, totalPages));

    const createUrl = (pageNumber: number): string => {
      const url = new URL(baseUrl);
      url.searchParams.set("page", pageNumber.toString());
      url.searchParams.set("limit", limit.toString());
      return url.toString();
    };

    const links = {
      first: createUrl(1),
      previous: currentPage > 1 ? createUrl(currentPage - 1) : null,
      current: createUrl(currentPage),
      next: currentPage < totalPages ? createUrl(currentPage + 1) : null,
      last: createUrl(totalPages),
    };

    const meta = {
      itemsPerPage: limit,
      totalItems: totalRecords,
      currentPage,
      totalPages,
      itemsCount: data.length,
    };

    return new Paginated<T>(data, meta, links);
  }
}

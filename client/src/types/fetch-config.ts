export interface FetchConfig<T> {
  config?: RequestInit;
  data: T;
}

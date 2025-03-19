export abstract class Service {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getSearchParams(options: Record<string, any>) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
      searchParams.set(key, value as string);
    }
    return searchParams;
  }
}

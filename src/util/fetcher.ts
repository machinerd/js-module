/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BaseInput<
  Filter extends Record<string, any> = Record<string, any>,
> {
  filter?: Filter;
  page: number;
  pageSize: number;
  sort?: string[];
}

export const createSdkFetcher = <
  TQuery extends Record<string, { total: number; list: any[] }>,
  TKey extends keyof TQuery,
  TInput extends BaseInput = BaseInput,
>(
  func: (variables: { input: TInput }) => Promise<TQuery>,
  key: TKey,
  customInput?: Partial<TInput>,
) => {
  return async (input: TInput) => {
    const result = await func({
      input: {
        filter: { ...customInput?.filter, ...input.filter },
        page: customInput?.page || input.page || 1,
        pageSize: customInput?.pageSize || input.pageSize || 10,
        sort: customInput?.sort || input.sort || [],
      } as TInput,
    });
    return result[key];
  };
};

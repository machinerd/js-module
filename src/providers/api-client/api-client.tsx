'use client';

import { createContext, useContext, useMemo } from 'react';
import ApiClient, { ApiConfig } from '../..';

const ApiClientContext = createContext<ApiClient | null>(null);

export function ApiClientProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: ApiConfig;
}) {
  const { apiEndpoint, cdnEndpoint } = config;
  const apiClient = useMemo(
    () => new ApiClient({ apiEndpoint, cdnEndpoint }),
    [apiEndpoint, cdnEndpoint],
  );

  return (
    <ApiClientContext.Provider value={apiClient}>
      {children}
    </ApiClientContext.Provider>
  );
}

export function useApiClient() {
  const apiClient = useContext(ApiClientContext);
  if (!apiClient) {
    throw new Error('ApiClient not found');
  }
  return apiClient;
}

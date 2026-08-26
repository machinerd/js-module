import { createContext, useContext } from 'react';
import ApiClient, { ApiConfig } from '../../';

const ApiClientContext = createContext<ApiClient | null>(null);

export default function ApiClientProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: ApiConfig;
}) {
  const apiClient = new ApiClient(config);

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

export interface ApiClientContext {
  readonly apiEndpoint: string;
  readonly cdnEndpoint: string;
  getToken: () => string | undefined;
  getBearer: () => string;
}

import Cookies from 'js-cookie';
import { Api } from './api';
import { Auth } from './auth';
import type { ApiClientContext } from './context';
import { Media } from './media';

export interface ApiConfig {
  apiEndpoint: string;
  cdnEndpoint: string;
}

export default class ApiClient {
  readonly auth: Auth;
  readonly api: Api;
  readonly media: Media;

  constructor(config: ApiConfig) {
    const ctx: ApiClientContext = {
      apiEndpoint: config.apiEndpoint,
      cdnEndpoint: config.cdnEndpoint,
      getToken: () => this.getToken(),
      getBearer: () => this.getBearer(),
    };

    this.auth = new Auth(ctx);
    this.api = new Api(ctx);
    this.media = new Media(ctx);
  }

  getToken() {
    return Cookies.get('access');
  }

  getBearer() {
    return `Bearer ${this.getToken()}`;
  }
}

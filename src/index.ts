import Cookies from 'js-cookie';
import qs from 'query-string';

export interface ApiConfig {
  apiEndpoint: string;
  cdnEndpoint: string;
}

export default class ApiClient {
  #apiEndpoint: string;
  #cdnEndpoint: string;

  constructor(config: ApiConfig) {
    this.#apiEndpoint = config.apiEndpoint;
    this.#cdnEndpoint = config.cdnEndpoint;
  }

  async login<T>(email: string, password: string) {
    const url = `${this.#apiEndpoint}/auth/login`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();
    return data as { ok: boolean; errors: Array<{ name: T; message: string }> };
  }

  getToken() {
    return Cookies.get('access');
  }

  getBearer() {
    return `Bearer ${this.getToken()}`;
  }

  async hasPermission(obj: string, act: string, exact = false, silent = false) {
    if (this.getToken() === undefined) {
      if (!silent) {
        throw new Error('로그인 필요');
      }
      return;
    }
    let url = `${this.#apiEndpoint}/has-permission?obj=${obj}&act=${act}`;
    if (exact) {
      url = `${url}&exact=true`;
    }
    const res = await fetch(url, {
      headers: { Authorization: this.getBearer() },
    });
    if (!res.ok) {
      if (!silent) {
        throw new Error('인증에러');
      }
      return;
    }
    const data = await res.json();
    return data;
  }

  cdnMedia(path: string, size?: number) {
    if (!path) {
      return '';
    }
    if (size) {
      const [prefix, key] = path.split('/');
      return `${this.#cdnEndpoint}/media/resized/${prefix}/${size}/${key}`;
    }
    return `${this.#cdnEndpoint}/media/${path}`;
  }

  cdnStatic(path: string, size?: number) {
    if (!path) {
      return '';
    }
    if (size) {
      const [prefix, key] = path.split('/');
      return `${this.#cdnEndpoint}/media/resized/${prefix}/${size}/${key}`;
    }
    return `${this.#cdnEndpoint}/static/${path}`;
  }

  getUploadPresignURL(param: {
    contentType: string;
    length: number;
    key: string;
    disposition?: string;
  }) {
    const queryString = qs.stringify(param);
    return fetch(`${this.#apiEndpoint}/upload/presign?${queryString}`, {
      credentials: 'include',
      headers: { Authorization: this.getBearer() },
    });
  }

  createParaMap(file: File, prefix?: string): UploadValues {
    const objectURL = URL.createObjectURL(file);
    const key = objectURL.split('/').pop() || '';
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const filename = `${
      prefix ? `${prefix.replace(/^\//, '')}/` : ''
    }${key}.${fileExt}`;
    const paraMap: UploadValues = {
      contentType: file.type || 'application/octet-stream',
      length: file.size,
      key: filename,
    };
    if (!file.type.includes('image')) {
      paraMap.disposition = `attachment; filename*=UTF8''${encodeURI(
        file.name,
      )}`;
    }
    return paraMap;
  }

  async upload(file: File, prefix?: string): Promise<string> {
    const param = this.createParaMap(file, prefix);
    const res = await this.getUploadPresignURL(param);
    const url = await res.json();

    const headers: Record<string, string> = {
      'Content-Length': param.length.toString(),
      'Content-Type': param.contentType.toString(),
    };
    if (param.disposition) {
      headers['Content-Disposition'] = param.disposition;
    }

    try {
      await fetch(url, {
        method: 'PUT',
        headers,
        body: file,
        credentials: 'include',
      });
    } catch (err) {
      return new Promise((_resolve, reject) => reject(err));
    }
    return new Promise((resolve) => resolve(param.key));
  }
}

export interface UploadValues {
  contentType: string;
  length: number;
  key: string;
  disposition?: string;
}

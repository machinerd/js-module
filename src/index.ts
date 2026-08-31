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

  logout(path = '/', domain = '.komachine.com') {
    const cookieOption: { path: string; domain?: string } = { path };

    if (window.location.hostname !== 'localhost') {
      cookieOption.domain = domain;
    }

    Cookies.remove('access', cookieOption);

    window.location.href = cookieOption.path;
  }

  getToken() {
    return Cookies.get('access');
  }

  getBearer() {
    return `Bearer ${this.getToken()}`;
  }

  async accessLog() {
    if (this.getToken() === undefined) {
      throw new Error('로그인 필요');
    }
    const url = `${this.#apiEndpoint}/access-log`;
    const res = await fetch(url, {
      headers: { Authorization: this.getBearer() },
    });
    if (!res.ok) {
      throw new Error('인증에러');
    }
    return await res.json();
  }

  async me() {
    if (this.getToken() === undefined) {
      throw new Error('로그인 필요');
    }
    const url = `${this.#apiEndpoint}/me`;
    const res = await fetch(url, {
      headers: { Authorization: this.getBearer() },
    });
    if (!res.ok) {
      throw new Error('인증에러');
    }
    return await res.json();
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
    return await res.json();
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

  refinePath(path?: string | null) {
    if (!path?.trim()) {
      return '';
    }
    if (path.startsWith('blob:')) {
      const lastSlashIndex = path.lastIndexOf('/');

      if (lastSlashIndex !== -1) {
        const beforeFile = path.substring(0, lastSlashIndex + 1);
        const fileName = path.substring(lastSlashIndex + 1);
        const extIndex = fileName.lastIndexOf('.');

        if (extIndex !== -1) {
          return beforeFile + fileName.substring(0, extIndex);
        }
      }
    }

    return this.cdnMedia(path);
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

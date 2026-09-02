import Cookies from 'js-cookie';
import type { ApiClientContext } from './context';

export class Auth {
  constructor(protected readonly ctx: ApiClientContext) {}

  async login<T>(email: string, password: string) {
    const url = `${this.ctx.apiEndpoint}/auth/login`;
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

  async accessLog() {
    if (this.ctx.getToken() === undefined) {
      throw new Error('로그인 필요');
    }
    const url = `${this.ctx.apiEndpoint}/access-log`;
    const res = await fetch(url, {
      headers: { Authorization: this.ctx.getBearer() },
    });
    if (!res.ok) {
      throw new Error('인증에러');
    }
    return await res.json();
  }

  async me() {
    if (this.ctx.getToken() === undefined) {
      throw new Error('로그인 필요');
    }
    const url = `${this.ctx.apiEndpoint}/me`;
    const res = await fetch(url, {
      headers: { Authorization: this.ctx.getBearer() },
    });
    if (!res.ok) {
      throw new Error('인증에러');
    }
    return await res.json();
  }

  async hasPermission(obj: string, act: string, exact = false, silent = false) {
    if (this.ctx.getToken() === undefined) {
      if (!silent) {
        throw new Error('로그인 필요');
      }
      return;
    }
    let url = `${this.ctx.apiEndpoint}/has-permission?obj=${obj}&act=${act}`;
    if (exact) {
      url = `${url}&exact=true`;
    }
    const res = await fetch(url, {
      headers: { Authorization: this.ctx.getBearer() },
    });
    if (!res.ok) {
      if (!silent) {
        throw new Error('인증에러');
      }
      return;
    }
    return await res.json();
  }
}

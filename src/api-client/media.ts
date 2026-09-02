import qs from 'query-string';
import type { ApiClientContext } from './context';

export interface UploadValues {
  contentType: string;
  length: number;
  key: string;
  disposition?: string;
}

export class Media {
  constructor(protected readonly ctx: ApiClientContext) {}

  cdnMedia(path: string, size?: number) {
    if (!path) {
      return '';
    }
    if (size) {
      const [prefix, key] = path.split('/');
      return `${this.ctx.cdnEndpoint}/media/resized/${prefix}/${size}/${key}`;
    }
    return `${this.ctx.cdnEndpoint}/media/${path}`;
  }

  cdnStatic(path: string, size?: number) {
    if (!path) {
      return '';
    }
    if (size) {
      const [prefix, key] = path.split('/');
      return `${this.ctx.cdnEndpoint}/media/resized/${prefix}/${size}/${key}`;
    }
    return `${this.ctx.cdnEndpoint}/static/${path}`;
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
    return fetch(`${this.ctx.apiEndpoint}/upload/presign?${queryString}`, {
      credentials: 'include',
      headers: { Authorization: this.ctx.getBearer() },
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

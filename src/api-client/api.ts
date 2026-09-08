import type { ApiClientContext } from './context';

export class Api {
  constructor(protected readonly ctx: ApiClientContext) {}

  async getPriorityPosition(priority: number, type: string) {
    const url = `${this.ctx.apiEndpoint}/assist/priority-current-position?priority=${priority}&type=${type}&order=desc`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();
    return data.result as { rank: number; total: number };
  }
}

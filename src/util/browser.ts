import Cookies from 'js-cookie';
import { uniq } from 'lodash-es';

export const getCookie = (key: string) => {
  return Cookies.get(key);
};

export const setCookies = (
  key: string,
  value: string,
  options?: Cookies.CookieAttributes,
) => {
  return Cookies.set(key, value, options);
};

export const getSearchHistory = () => {
  if (typeof window === 'undefined') {
    return [];
  }
  const history = JSON.parse(
    localStorage.getItem('search-history') || '[]',
  ) as string[];
  return history;
};

export const insertSearchHistory = (item: string) => {
  const history = uniq([item, ...getSearchHistory()]).slice(0, 10);
  localStorage.setItem('search-history', JSON.stringify(history));
  return history;
};

export const deleteSearchHistory = (index: number) => {
  const history = getSearchHistory();
  history.splice(index, 1);
  localStorage.setItem('search-history', JSON.stringify(history));
  return history;
};

export const deleteAllSearchHistory = () => {
  localStorage.setItem('search-history', JSON.stringify([]));
};

export const isSearchPage = (pathname: string) => {
  return pathname.endsWith('/search');
};

export const appendSearchPath = (pathname: string) => {
  if (isSearchPage(pathname)) {
    return pathname;
  }
  return `${pathname}/search`.replace('//', '/');
};

export const clearSearchPath = (pathname: string) => {
  return pathname.replace('/search', '').replace('//', '/');
};

export const clearQueryByKey = (query: Record<string, any>, key: string) => {
  const searchParams = new URLSearchParams(query);
  searchParams.delete(key);
  return Object.fromEntries(searchParams);
};

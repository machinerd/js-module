import dayjs from 'dayjs';
import 'dayjs/locale/ko.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

import Cookies from 'js-cookie';
import { intersection, uniq } from 'lodash-es';
import { customAlphabet } from 'nanoid';
import qs from 'query-string';
import slug from 'slug';
import libphonenumber from 'google-libphonenumber';
const PhoneNumberFormat = libphonenumber.PhoneNumberFormat;
const PhoneNumberUtil = libphonenumber.PhoneNumberUtil;

const phoneUtil = PhoneNumberUtil.getInstance();

dayjs.extend(relativeTime);

slug.extend({ '"': '-', '”': '-', '“': '-', '•': '----' });
slug.setLocale('en');

export const displayDatetime = (
  date: string,
  format = 'YYYY-MM-DD',
  locale = 'en',
) => {
  const d = dayjs(date).locale(locale);
  const now = dayjs();
  const diff = now.diff(d, 'hour');
  if (diff < 12) {
    return d.fromNow();
  }
  return d.format(format);
};

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

export const link = (
  param: Record<string, string>,
  deleteKeys: string[] = [] as string[],
) => {
  if (typeof window === 'undefined') {
    return '';
  }
  const { hash, search } = window.location;
  const queryMap = qs.parse(search);
  Object.keys(param).forEach((key) => {
    if (param[key]) {
      queryMap[key] = param[key];
    } else {
      delete queryMap[key];
    }
  });
  const query = { ...queryMap };
  Object.keys(queryMap).forEach((key) => {
    if (deleteKeys.includes(key)) {
      delete query[key];
    }
  });
  return `?${qs.stringify(query, {
    encode: true,
  })}${hash}`;
};

interface UploadValues {
  contentType: string;
  length: number;
  key: string;
  disposition?: string;
}

interface Address {
  address: string;
  addressEn: string;
  postcode: string;
  jibun: string;
}

interface AddressData {
  perPage: number;
  page: number;
  total: number;
  jusoList: Address[];
}

interface AddressResponse {
  data: AddressData;
}

export const calcPageCount = (total: number, perPage: number) => {
  let pageCount = 0;
  if (total % perPage === 0) {
    pageCount = total / perPage;
  }
  pageCount = Math.ceil(total / perPage);
  if (pageCount < 1) {
    pageCount = 1;
  }
  return pageCount;
};

// fisher-Yates 알고리즘
export const shuffle = <T>(arr: T[]) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); //random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap
  }
  return shuffled;
};

const generateCandidates = (min: number, max: number) => {
  const candidates = [];
  for (let i = min; i < max; i++) {
    candidates.push(i);
  }
  return candidates;
};

export const randomNum = (min: number, max: number, count = 1) => {
  const rn: number[] = [];
  const candidates = generateCandidates(min, max);
  while (rn.length < count) {
    const mn = Math.ceil(min);
    const mx = Math.floor(candidates.length);
    const r = Math.floor(Math.random() * (mx - mn)) + mn;
    const ra = candidates.splice(r, 1);
    rn.push(ra[0]);
  }
  return [...rn];
};

export const loadExLib = (callback: () => void) => {
  const existingScript = document.getElementById('naverMapLib');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src =
      'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=ecs1pyoo9b';
    script.id = 'naverMapLib';
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) {
        callback();
      }
    };
  }
  if (existingScript && callback) {
    callback();
  }
};

export const recomposeI18nNumber = (
  locale: string,
  number?: string | null,
  i18nNumber?: string | null,
) => {
  if (!number) {
    return '-';
  }
  if (locale === 'ko' && i18nNumber && i18nNumber !== '82') {
    const nn = number.replace(/^0/, '');
    return `+${i18nNumber}-${nn}`;
  }
  if (locale !== 'ko' && i18nNumber) {
    const nn = number.replace(/^0/, '');
    return `+${i18nNumber}-${nn}`;
  }
  return number;
};

interface Country {
  alpha2Code: string;
  callingCode: string;
}

export interface I18nNumberProps<C extends Country = Country> {
  phone?: string | null;
  country?: C | null;
  format?: number;
  locale?: string | null;
}

export const formatI18nNumber = ({
  phone,
  country = {
    callingCode: '82',
    alpha2Code: 'KR',
  },
  format = PhoneNumberFormat.INTERNATIONAL,
  locale,
}: I18nNumberProps) => {
  if (!phone || phone === '-') return '-';

  try {
    const phoneNumber = phoneUtil.parseAndKeepRawInput(
      phone,
      country?.alpha2Code || 'KR',
    );
    const countryCode = phoneNumber.getCountryCode();

    if (locale === 'ko' && country?.alpha2Code === 'KR' && countryCode === 82) {
      return phoneUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL);
    }

    return phoneUtil.format(phoneNumber, format);
  } catch {
    return recomposeI18nNumber(locale || 'en', phone, country?.callingCode);
  }
};

export const slugify = (
  base: string | number,
  ...args: Array<string | undefined>
) => {
  let s = `${base}`;
  args.forEach((arg) => {
    if (arg) {
      s = `${s}-${slug(arg)}`;
    }
  });
  return s;
};

interface Product<I extends I18n = I18n> {
  id: number;
  stockNo?: string[];
  series?: Series<I> | null;
  i18n: I[];
}

interface Series<I extends I18n = I18n> {
  i18n: I[];
}

interface I18n {
  name?: string | null;
  locale: string;
  priority: number;
}

export const productSlugify = (product: Product) => {
  const data: string[] = [];
  product.i18n?.forEach((i18n) => {
    if (i18n.locale === 'en' && i18n.name) {
      data.push(i18n.name);
    }
  });
  const seriesEn = product.series?.i18n.find((i18n) => i18n.locale === 'en');
  if (seriesEn?.name) {
    data.push(seriesEn.name.toLowerCase());
  }
  if (product.stockNo) {
    data.push(product.stockNo[0]);
  }
  return slugify(product.id, ...data);
};

export const getModelName = (modelName: string[]) => {
  const modelNames = modelName;
  if (modelNames.length > 0) {
    return modelNames[0].trim();
  }
  return '';
};

export const getI18nValues = <
  T extends {
    locale: string;
    priority: number;
  },
  K extends keyof T,
>(
  locale = 'en',
  values: T[],
  key: K,
): T[K] => {
  if (!values || !key || values.length <= 0) {
    return '' as T[K];
  }
  const newValues = [...values];
  const sorted = newValues!.sort(comparePriorityAsc);
  if (locale) {
    const matchIndex = sorted.findIndex((v) => v.locale === locale);

    if (matchIndex) {
      const matched = sorted.splice(matchIndex, 1);
      sorted.unshift(matched[0]);
    }
  }
  for (const value of sorted) {
    const vv = value[key!];
    if (Array.isArray(vv) && vv.length === 0) {
      continue;
    }
    if (vv) {
      return vv;
    }
  }
  return '' as T[K];
};

export const getI18nValue = <
  T extends {
    locale: string;
    priority: number;
    [key: string]: string | number | null | undefined;
  },
>(
  locale?: string,
  values?: T[],
  key?: keyof T,
) => {
  if (!values || !key || values.length <= 0) {
    return '';
  }

  const newValues = [...values];
  const sorted = newValues!.sort(comparePriorityAsc);
  if (locale) {
    const matchIndex = sorted.findIndex((v) => v.locale === locale);
    if (matchIndex) {
      const matched = sorted.splice(matchIndex, 1);
      sorted.unshift(matched[0]);
    }
  }
  let v = '';
  for (const value of sorted) {
    const vv = value[key!];
    if (vv) {
      v = String(vv);
      break;
    }
  }
  return v;
};

export const comparePriorityAsc = <T extends { priority: number }>(
  a: T,
  b: T,
) => {
  if (a.priority < b.priority) {
    return -1;
  }
  if (a.priority > b.priority) {
    return 1;
  }
  return 0;
};

export const genNanoID = () => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 5);
  return nanoid();
};

export const printNanoID = (cnt: number) => {
  for (let i = 0; i < cnt; i++) {
    console.log(genNanoID());
  }
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

export const parseQuery = <T, F = T>(
  q: string | string[] | undefined | null,
  conv: (v: string) => T,
  fallback: F,
) => {
  if (q) {
    let temp;
    if (Array.isArray(q)) {
      temp = q[0];
    } else {
      temp = q;
    }
    try {
      const v = conv(temp);
      return v;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export const withoutProperty = <T>(obj: T, property: keyof T) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [property]: _, ...rest } = obj;
  return rest;
};

export const withoutProperties = <T extends Record<string, unknown>>(
  obj: T,
  properties: Array<keyof T>,
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !properties.includes(k as keyof T)),
  ) as T;
};

export const existLeastOne = <T>(a: T[], b: T[]) => {
  return intersection(a, b).length > 0;
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

export const getI18nKey = (key: string) => {
  const splitNs = key.split(':');
  const withoutNs = splitNs.pop();
  return withoutNs?.split('.').pop();
};

export const composeKey = (
  prefix?: Array<string | number> | string,
  ...keys: Array<string | number>
) => {
  return [prefix, keys].flat().join('.').replace(':.', '.');
};

export function formatBytes(bytes: number, decimals = 0) {
  if (bytes == 0) return '0 Bytes';
  const k = 1024,
    dm = decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const getFilename = (s: string) => {
  return s.split('.').slice(0, -1).join('.');
};

export const getFileExtension = (s: string) => {
  return s.split('.').pop();
};

interface PathInfo {
  directory: string;
  filename: string;
  extension: string;
  filenameWithoutExtension: string;
}

export const parsePath = (filepath: string, isStatic?: boolean): PathInfo => {
  const result = {
    directory: '',
    filename: '',
    extension: '',
    filenameWithoutExtension: '',
  };

  const lastSlashIndex = filepath.lastIndexOf('/');
  const filename =
    lastSlashIndex >= 0 ? filepath.substring(lastSlashIndex + 1) : filepath;

  const lastDotIndex = filename.lastIndexOf('.');
  const extension =
    lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : '';
  const filenameWithoutExtension =
    lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;

  result.filename = filename;
  result.extension = extension;
  result.filenameWithoutExtension = filenameWithoutExtension;

  if (filepath.startsWith('http')) {
    const cdnPath = isStatic ? '/static/' : '/media/';
    const cdnIndex = filepath.indexOf(cdnPath);
    if (cdnIndex !== -1) {
      const afterCdn = filepath.substring(cdnIndex + cdnPath.length);
      const lastSlashIndex = afterCdn.lastIndexOf('/');

      result.directory =
        lastSlashIndex !== -1 ? afterCdn.substring(0, lastSlashIndex) : '';

      return result;
    }
  }

  result.directory =
    lastSlashIndex !== -1 ? filepath.substring(0, lastSlashIndex) : '';
  return result;
};

interface Location<I extends LocationI18n = LocationI18n> {
  i18n: I[];
}

interface LocationI18n extends I18n {
  address1?: string | null;
  address2?: string | null;
}

export const getFirstLocationAddress = (
  locale = 'en',
  locations: Location[],
) => {
  if (locations.length <= 0) {
    return '-';
  }
  const location = locations[0];
  if (!location) {
    return '-';
  }
  return getFullAddress(locale, location.i18n);
};

export const getFullAddress = (locale = 'en', values: LocationI18n[]) => {
  if (values.length === 0) {
    return '';
  }
  const address1 =
    getI18nValues(locale, values, 'address1')?.replace('대한민국', '') || '';
  const address2 = values.find((v) => v.locale === locale)?.address2;
  const addressParts: Array<string | undefined | null> = [address1];
  if (locale === 'ko') {
    addressParts.push(address2);
  } else {
    addressParts.unshift(address2);
  }
  return addressParts.filter(Boolean).join(', ').trim();
};

export const selectItemByWeight = <T extends { weight: number }>(
  itemsWithWeights: T[],
) => {
  let totalWeight = 0;
  for (const item of itemsWithWeights) {
    totalWeight += item.weight;
  }

  const randomNumber = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const item of itemsWithWeights) {
    cumulativeWeight += item.weight;
    if (randomNumber < cumulativeWeight) {
      return item;
    }
  }
  return itemsWithWeights[itemsWithWeights.length - 1];
};

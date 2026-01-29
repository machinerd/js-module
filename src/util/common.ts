import { intersection } from 'lodash-es';
import qs from 'query-string';
import slug from 'slug';
import libphonenumber from 'google-libphonenumber';
const PhoneNumberFormat = libphonenumber.PhoneNumberFormat;
const PhoneNumberUtil = libphonenumber.PhoneNumberUtil;

const phoneUtil = PhoneNumberUtil.getInstance();

slug.extend({ '"': '-', '”': '-', '“': '-', '•': '----' });
slug.setLocale('en');

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

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

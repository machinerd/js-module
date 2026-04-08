import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const formatCompactNumber = (number: number, locale = 'en-US', options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
    ...options,
  }).format(number);
};

export const formatExceedNumber = (number: number, threshold: number, suffix = '+') => {
  if (number > threshold) return `${threshold}${suffix}`;
  return String(number);
};

export const formatKoNumber = (number?: number | string | null) => {
  return number?.toLocaleString('ko-KR') || '0';
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

export type PhoneFormatType = 'international' | 'national' | 'rfc3966';

export interface I18nNumberProps {
  phone?: string | null;
  alpha2Code?: string;
  callingCode?: string;
  format?: PhoneNumberFormat;
  locale?: string;
}

export const formatI18nNumber = ({
  phone,
  alpha2Code,
  callingCode,
  format = PhoneNumberFormat.RFC3966,
  locale = 'en',
}: I18nNumberProps) => {
  if (!phone?.trim()) return '';

  try {
    const phoneNumber = phoneUtil.parse(phone, alpha2Code);

    return phoneUtil.format(phoneNumber, format);
  } catch {
    return recomposeI18nNumber(locale, phone, callingCode);
  }
};

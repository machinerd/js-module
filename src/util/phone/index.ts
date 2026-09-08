import lib from 'google-libphonenumber';

const { PhoneNumberUtil, PhoneNumberFormat } = lib;

const phoneUtil = PhoneNumberUtil.getInstance();

export type PhoneFormatType = 'international' | 'national' | 'rfc3966';

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

export interface I18nNumberProps {
  phone?: string | null;
  alpha2Code?: string;
  callingCode?: string;
  format?: keyof typeof PhoneNumberFormat;
  locale?: string;
}

export const formatI18nNumber = ({
  phone,
  alpha2Code,
  callingCode,
  format = 'RFC3966',
  locale = 'en',
}: I18nNumberProps) => {
  if (!phone?.trim()) return '';

  try {
    const phoneNumber = phoneUtil.parse(phone, alpha2Code);

    return phoneUtil.format(phoneNumber, PhoneNumberFormat[format]);
  } catch {
    return recomposeI18nNumber(locale, phone, callingCode);
  }
};

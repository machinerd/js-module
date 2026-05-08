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

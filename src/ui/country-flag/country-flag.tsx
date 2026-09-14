'use client';

import { lowerCase } from 'lodash-es';
import { type HTMLAttributes, type SyntheticEvent, useMemo } from 'react';

const CDN_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/';

/**
 * Props for {@link CountryFlag}. Other attributes go to the `<img>`.
 * `onError` is ignored (the image removes itself on error).
 */
export interface CountryFlagProps extends HTMLAttributes<HTMLImageElement> {
  /**
   * ISO 3166-1 alpha-2 code, case-insensitive (e.g. `'KR'`, `'us'`).
   * Also used as the image `alt` text.
   */
  countryCode: string;
}

/**
 * Country flag image loaded from the flag-icon-css CDN. Rendered at
 * 34×24px; resize with `className` or `style`. If the flag fails to load,
 * the `<img>` is removed from the DOM.
 *
 * @example
 * <CountryFlag countryCode="KR" />
 *
 * @example
 * <CountryFlag countryCode={country.alpha2Code} style={{ width: 20, height: 15 }} />
 */
export const CountryFlag = ({ countryCode, ...props }: CountryFlagProps) => {
  const src = useMemo(
    () => CDN_URL + lowerCase(countryCode) + '.svg',
    [countryCode],
  );

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.remove();
  };

  return (
    <img
      data-komc
      width="34px"
      height="24px"
      src={src}
      alt={countryCode}
      {...props}
      onError={handleError}
    />
  );
};

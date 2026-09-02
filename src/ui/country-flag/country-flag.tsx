'use client';

import { lowerCase } from 'lodash-es';
import { type HTMLAttributes, type SyntheticEvent, useMemo } from 'react';

const CDN_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/';

export interface CountryFlagProps extends HTMLAttributes<HTMLImageElement> {
  countryCode: string;
}

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

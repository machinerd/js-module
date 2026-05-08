'use client';

import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isExternalSrc, isSrcSetCompatible, parsePath } from "../util/file";
import { useApiClient } from "../providers";

export const SUBSETS = [12, 120, 240, 300, 406, 512, 612, 768, 960, 1024, 1280, 1440, 1560, 1920, 2560, 3840];

export type Folder = 'media' | 'static';

export interface BaseProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  ref?: React.ForwardedRef<HTMLImageElement>;
  src: string;
  forceLoad?: boolean;
  origin?: boolean;
  originalWidth: number;
  fallbackSrc?: string;
  folder?: Folder;
}

export type UseSubsetImageProps = BaseProps &
  (
    | {
        fill: true;
        sizes: string;
        width?: never;
        height?: never;
      }
    | {
        fill?: false;
        sizes?: never;
        width: number;
        height: number;
      }
  );

export default function useSubsetImage({ 
  ref,
  src, 
  forceLoad = false,
  folder = 'media', 
  fallbackSrc,
  origin, 
  originalWidth, 
  loading = 'lazy',
  ...rest
}: UseSubsetImageProps) {
  const apiClient = useApiClient();
  const [fallbackStep, setFallbackStep] = useState(0);
  const [isLoad, setIsLoad] = useState(forceLoad || !Boolean(src));
  const [isError, setIsError] = useState(!Boolean(src));
  const internalRef = useRef<HTMLImageElement | null>(null);
  const pendingErrorEventRef = useRef<SyntheticEvent<HTMLImageElement, Event> | null>(null);

  const combinedRef = useCallback(
    (node: HTMLImageElement | null) => {
      internalRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLImageElement | null>).current = node;
      }
    },
    [ref],
  );

  const cdnFn = useCallback((src: string, folder: Folder) => {
    const replaceSrc = src.startsWith('/') ? src.slice(1) : src;
    return folder === 'static' ? apiClient.cdnStatic(replaceSrc) : apiClient.cdnMedia(replaceSrc);
  }, [apiClient]);

  const availableSubsets = useMemo(() => SUBSETS.filter((subset) => subset <= originalWidth), [originalWidth]);
  const validatedSrc = useMemo(() => isExternalSrc(src) ? src : cdnFn(src, folder), [cdnFn, src, folder]);

  const srcSet = useMemo(() => {
    if (origin || !isSrcSetCompatible(src) || availableSubsets.length === 0) return undefined;

    const { filenameWithoutExtension, directory } = parsePath(src, folder);

    if (rest.width) {
      const nearestSubset =
        availableSubsets.find((subset) => subset >= rest.width) ??
        availableSubsets[availableSubsets.length - 1]!;

      const target2xWidth = nearestSubset * 2;
      const nearest2xSubset =
        availableSubsets.find((subset) => subset >= target2xWidth) ??
        availableSubsets[availableSubsets.length - 1]!;

      return `${cdnFn(`${directory}/subsets/w${nearestSubset}/${filenameWithoutExtension}.webp`, folder)} 1x,${cdnFn(`${directory}/subsets/w${nearest2xSubset}/${filenameWithoutExtension}.webp`, folder)} 2x`;
    }

    let result = '';
    for (const subset of availableSubsets) {
      result += `${cdnFn(`${directory}/subsets/w${subset}/${filenameWithoutExtension}.webp`, folder)} ${subset}w, `;
    }

    return result.trim();
  }, [availableSubsets, cdnFn, folder, origin, src, rest.width]);

  const makeFallbackSrc = useCallback((src: string, folder: Folder) => {
    const { filenameWithoutExtension, directory } = parsePath(src, folder);
  
    return `${cdnFn(`${directory}/subsets/origin/${filenameWithoutExtension}.webp`, folder)}`;
  }, [cdnFn]);

  const fallbackSrcSet = useMemo(() => {
    if (src) {
      return `${makeFallbackSrc(src, folder)} 1x`;
    }
    return undefined;
  }, [src, folder, makeFallbackSrc]);

  const handleError = useCallback(
    (event?: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setFallbackStep((prev) => {
        if (prev >= 2) {
          if (event) pendingErrorEventRef.current = event;
          return 3;
        }
        return prev + 1;
      });
    },
    [],
  );

  const currentSrcSet = (() => {
    if (fallbackStep === 0) return srcSet;
    if (fallbackStep === 1) return fallbackSrcSet;
    return undefined;
  });
  const currentSrc = fallbackStep >= 3 ? fallbackSrc : validatedSrc;
  const currentSizes = fallbackStep === 0 ? rest.sizes : undefined;
  const currentLoading = fallbackStep > 0 ? 'eager' : loading;

  useEffect(() => {
    if (fallbackStep < 3) return;
    setIsError(true);
  }, [fallbackStep]);

  useEffect(() => {
    const img = internalRef.current;

    if (!img || isError) return;

    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
      handleError();
      return;
    }

    if (img.complete && img.naturalWidth > 0) {
      setIsLoad(true);
      return;
    }

    const handleLoad = () => {
      if (img.naturalWidth > 0) {
        setIsLoad(true);
      }
    };

    img.addEventListener('load', handleLoad);

    return () => img.removeEventListener('load', handleLoad);
  }, [isError, fallbackStep, handleError]);

  const { fill: _, ...imageProps } = rest;

  return {
    ref: combinedRef,
    isLoad,
    isError,
    imageProps: {
      ...imageProps,
      src: currentSrc,
      srcSet: currentSrcSet(),
      sizes: currentSizes,
      loading: currentLoading,
      onError: isError ? undefined : handleError,
    },
  };
}

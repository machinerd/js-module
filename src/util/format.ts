export const formatCompactNumber = (
  number: number,
  locale = 'en-US',
  options?: Intl.NumberFormatOptions,
) => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
    ...options,
  }).format(number);
};

export const formatExceedNumber = (
  number: number,
  threshold: number,
  suffix = '+',
) => {
  if (number > threshold) return `${threshold}${suffix}`;
  return String(number);
};

export const formatKoNumber = (number?: number | string | null) => {
  return number?.toLocaleString('ko-KR') || '0';
};

interface ComputeAspectRatioParams {
  min: { width: number; height: number };
  max: { width: number; height: number };
  width: number;
  height: number;
  type: 'width' | 'height';
  currentRatio?: number;
}

export type ComputeAspectRatioWarning =
  'width-under-min' | 'width-over-max' | 'height-under-min';

interface ComputeAspectRatioResult {
  width: number;
  height: number;
  result: ComputeAspectRatioWarning | null;
}

export const computeAspectRatio = ({
  min,
  max,
  width,
  height,
  type,
  currentRatio,
}: ComputeAspectRatioParams): ComputeAspectRatioResult => {
  let w = width;
  let h = height;
  let result: ComputeAspectRatioWarning | null = null;
  let ratio = 1;
  if (typeof currentRatio === 'number' && currentRatio > 0) {
    ratio = currentRatio;
  } else if (height > 0) {
    ratio = width / height;
  }

  if (type === 'width') {
    h = Math.round(width / ratio);

    if (width < min.width) {
      result = 'width-under-min';
    }
    if (width > max.width) {
      result = 'width-over-max';
    }
    if (h < min.height) {
      result = 'height-under-min';
    }
  }
  if (type === 'height') {
    w = Math.round(height * ratio);

    if (height < min.height) {
      result = 'height-under-min';
    }
    if (w < min.width) {
      result = 'width-under-min';
    }
    if (w > max.width) {
      result = 'width-over-max';
    }
  }

  return { width: w, height: h, result };
};

'use client';

import type { PastedImageUploaderOptions } from '../../../util/image-upload';
import { PastedImage } from './pasted-image';

export function createPastedImageExtension(
  options: PastedImageUploaderOptions,
) {
  return PastedImage.configure(options);
}

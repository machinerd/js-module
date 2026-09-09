'use client';

import {
  FieldPath,
  FieldValues,
  PathValue,
  UseFormSetValue,
} from 'react-hook-form';
import { useApiClient } from '../../providers/api-client';
import { ChangeEvent } from 'react';

export function useFormUtil<T extends FieldValues>(
  setValue: UseFormSetValue<T>,
) {
  const apiClient = useApiClient();

  const handleMediaUpload = async (
    file: File,
    path: string,
    fieldName: FieldPath<T>,
  ) => {
    const key = await apiClient.media.upload(file, path);
    const fileName = key.split('/').pop();
    setValue(
      fieldName,
      `blob:${window.location.origin}/${fileName}` as PathValue<
        T,
        FieldPath<T>
      >,
      {
        shouldDirty: true,
      },
    );
  };

  const handleMediaDrop = (path: string, fieldName: FieldPath<T>) => {
    return async (file: File) => {
      if (file) {
        await handleMediaUpload(file, path, fieldName);
      }
    };
  };

  const handleMediaUpdate = (path: string, fieldName: FieldPath<T>) => {
    return async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await handleMediaUpload(file, path, fieldName);
      }
    };
  };

  return {
    handleMediaUpload,
    handleMediaDrop,
    handleMediaUpdate,
  };
}

'use client';

import { SnackbarProvider } from 'notistack';
import { ComponentProps } from 'react';

export function NotiStackProvider({
  maxSnack = 3,
  ...props
}: ComponentProps<typeof SnackbarProvider>) {
  return <SnackbarProvider maxSnack={maxSnack} {...props} />;
}

'use client';

import { useSnackbar as useSnackbarBase } from 'notistack';

export function useSnackbar() {
  const { enqueueSnackbar } = useSnackbarBase();

  /**
   * Show a success snackbar
   * @param msg
   * @default autoHideDuration 2000ms
   * @default anchorOrigin { horizontal: 'left', vertical: 'bottom' }
   */
  const successSnackbar = (msg: string) => {
    enqueueSnackbar(msg, {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        horizontal: 'left',
        vertical: 'bottom',
      },
    });
  };

  /**
   * Show a error snackbar
   * @param msg
   * @default autoHideDuration 2000ms
   * @default anchorOrigin { horizontal: 'left', vertical: 'bottom' }
   */
  const errSnackbar = (msg: string) => {
    enqueueSnackbar(msg, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        horizontal: 'left',
        vertical: 'bottom',
      },
    });
  };

  return {
    enqueueSnackbar,
    successSnackbar,
    errSnackbar,
  };
}

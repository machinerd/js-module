'use client';

import { createContext, useContext, type CSSProperties } from 'react';
import type { useFloating, useInteractions } from '@floating-ui/react';

export interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  refs: ReturnType<typeof useFloating>['refs'];
  floatingStyles: CSSProperties;
  getReferenceProps: ReturnType<typeof useInteractions>['getReferenceProps'];
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  preserveFocus: boolean;
}

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdown must be used within Dropdown');
  }

  return context;
}

export function useOptionalDropdown() {
  return useContext(DropdownContext);
}

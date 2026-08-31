'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type Placement,
  type VirtualElement,
} from '@floating-ui/react';
import { useDialogStack } from '../../hooks/use-dialog-stack';
import { DropdownContext, type DropdownContextValue } from './dropdown-context';
import { DropdownContent } from './dropdown-content';
import { DropdownTrigger } from './dropdown-trigger';

export interface DropdownProps {
  trigger?: ReactElement;
  reference?: VirtualElement;
  children: ReactNode;
  placement?: Placement;
  boundary?: Element | null;
  offset?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  preserveFocus?: boolean;
  role?: 'menu' | 'listbox' | 'dialog';
}

export function Dropdown({
  trigger,
  reference,
  children,
  placement = 'bottom-start',
  boundary,
  offset = 8,
  maxWidth,
  maxHeight = 300,
  className,
  open: controlledOpen,
  onOpenChange,
  preserveFocus = false,
  role = 'menu',
}: DropdownProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  useDialogStack(open, close, false);

  const middleware = useMemo(
    () => [
      offsetMiddleware(offset),
      flip({
        boundary: boundary ?? undefined,
        padding: 8,
      }),
      shift({
        boundary: boundary ?? undefined,
        padding: 8,
      }),
      size({
        boundary: boundary ?? undefined,
        padding: 8,
        apply({ availableHeight, availableWidth, elements }) {
          const nextStyle: Partial<CSSStyleDeclaration> = {
            maxHeight: `${Math.min(availableHeight, maxHeight)}px`,
            overflowY: 'auto',
          };

          if (maxWidth != null) {
            nextStyle.maxWidth = `${Math.min(availableWidth, maxWidth)}px`;
          }

          Object.assign(elements.floating.style, nextStyle);
        },
      }),
    ],
    [boundary, maxHeight, maxWidth, offset],
  );

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { escapeKey: false });
  const floatingRole = useRole(context, { role });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    floatingRole,
  ]);

  useEffect(() => {
    if (reference) {
      refs.setPositionReference(reference);
    }
  }, [reference, refs]);

  const value = useMemo<DropdownContextValue>(
    () => ({
      open,
      setOpen,
      close,
      refs,
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
      preserveFocus,
    }),
    [
      close,
      floatingStyles,
      getFloatingProps,
      getReferenceProps,
      open,
      preserveFocus,
      refs,
      setOpen,
    ],
  );

  return (
    <DropdownContext.Provider value={value}>
      {trigger ? <DropdownTrigger asChild>{trigger}</DropdownTrigger> : null}
      {trigger ? (
        <DropdownContent className={className}>{children}</DropdownContent>
      ) : (
        children
      )}
    </DropdownContext.Provider>
  );
}

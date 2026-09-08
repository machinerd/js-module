import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  flip,
  offset as offsetMiddleware,
  shift,
  size,
  autoUpdate,
  FloatingPortal,
  type Placement,
  type VirtualElement,
} from '@floating-ui/react';
import clsx from 'clsx';
import { useDialogStack } from '../../hooks/use-dialog-stack';

export type DropdownReference = VirtualElement;

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    return {
      open: false,
      setOpen: () => {},
      close: () => {},
    };
  }

  return context;
}

export interface DropdownProps {
  trigger?: ReactNode;
  reference?: DropdownReference | null;
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
  zIndex?: number;
}

export default function Dropdown({
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
  preserveFocus = true,
  zIndex = 99999,
}: DropdownProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  const dropdownContext = useMemo(
    () => ({ open, setOpen, close }),
    [open, setOpen, close],
  );

  useDialogStack(open, close);

  const {
    refs: { setReference, setFloating, setPositionReference },
    floatingStyles,
    isPositioned,
    context,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offsetMiddleware(offset),
      flip({
        boundary: boundary ?? undefined,
        fallbackStrategy: 'initialPlacement',
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
          const constrainedHeight = Math.min(
            availableHeight,
            maxHeight ?? Infinity,
          );

          const style: Partial<CSSStyleDeclaration> = {
            maxHeight: `${constrainedHeight}px`,
            overflowY: 'auto',
          };

          if (maxWidth != null) {
            style.maxWidth = `${Math.min(availableWidth, maxWidth)}px`;
          }

          Object.assign(elements.floating.style, style);
        },
      }),
    ],
  });

  const click = useClick(context, { enabled: Boolean(trigger) });
  const dismiss = useDismiss(context, {
    outsidePress: false,
    escapeKey: false,
  });
  const role = useRole(context, { role: 'menu' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  useLayoutEffect(() => {
    if (!reference) {
      return;
    }

    setPositionReference(reference);
    if (!trigger) {
      setReference(reference);
    }
  }, [reference, setPositionReference, setReference, trigger]);

  return (
    <>
      {trigger != null && trigger !== false && (
        <span
          data-komc
          className="komc:inline-flex"
          ref={setReference}
          {...getReferenceProps()}
        >
          {trigger}
        </span>
      )}
      {open && (
        <FloatingPortal>
          <div data-komc className="komc:fixed komc:inset-0" style={{ zIndex }}>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close dropdown"
              className="komc:absolute komc:inset-0 komc:cursor-default komc:bg-transparent"
              onPointerDown={(event) => {
                event.preventDefault();
                setOpen(false);
              }}
            />
            <div
              ref={setFloating}
              style={{
                ...floatingStyles,
                visibility: isPositioned ? 'visible' : 'hidden',
              }}
              className={clsx('komc:mt-0.5 komc:drop-shadow-md', className)}
              {...getFloatingProps({
                tabIndex: -1,
                onPointerDown: preserveFocus
                  ? (event) => {
                      event.preventDefault();
                    }
                  : undefined,
              })}
            >
              <DropdownContext.Provider value={dropdownContext}>
                {children}
              </DropdownContext.Provider>
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

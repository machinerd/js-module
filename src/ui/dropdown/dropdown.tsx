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

/**
 * Anything with `getBoundingClientRect()` — a DOM element or a virtual
 * element such as `{ getBoundingClientRect: () => rect }`.
 */
export type DropdownReference = VirtualElement;

interface DropdownContextValue {
  /** Whether the dropdown is open. */
  open: boolean;
  /** Open or close the dropdown. */
  setOpen: (open: boolean) => void;
  /** Close the dropdown. */
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

/**
 * Reads the nearest `Dropdown`'s open state from inside its content,
 * e.g. to close the menu after an item is picked.
 *
 * Outside a `Dropdown`, returns `open: false` and no-op functions
 * (does not throw).
 *
 * @example
 * const MenuItem = ({ onSelect }: { onSelect: () => void }) => {
 *   const { close } = useDropdown();
 *   return (
 *     <button onClick={() => { onSelect(); close(); }}>Duplicate</button>
 *   );
 * };
 */
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
  /**
   * Element that toggles the dropdown on click. Wrapped in an inline
   * `<span>` used as the anchor.
   *
   * Omit it to open programmatically with `open` + `reference`.
   */
  trigger?: ReactNode;
  /**
   * Position anchor used instead of the trigger — a DOM element or a
   * virtual element (`{ getBoundingClientRect }`), e.g. a caret or
   * click position. Without `trigger`, control the dropdown with `open`.
   */
  reference?: DropdownReference | null;
  /** Menu content. Call {@link useDropdown} inside it to close the menu. */
  children: ReactNode;
  /**
   * Preferred placement. Flips and shifts automatically to stay in view.
   * @default 'bottom-start'
   */
  placement?: Placement;
  /** Clipping boundary used for flip/shift/size. Defaults to the viewport. */
  boundary?: Element | null;
  /**
   * Gap between anchor and menu, in px.
   * @default 8
   */
  offset?: number;
  /** Max menu width in px. Unlimited if omitted. */
  maxWidth?: number;
  /**
   * Max menu height in px. Content scrolls beyond it.
   * @default 300
   */
  maxHeight?: number;
  /** Class name for the floating menu container. */
  className?: string;
  /**
   * Controlled open state. When omitted, the dropdown manages its own state
   * (opened by clicking `trigger`).
   */
  open?: boolean;
  /**
   * Called whenever the dropdown wants to open or close (trigger click,
   * outside click, Escape, `close()`). Required to update `open`
   * when controlled.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Prevent pointer-down inside the menu from moving focus, so e.g. an
   * input or editor keeps focus while an item is clicked.
   * @default true
   */
  preserveFocus?: boolean;
  /**
   * `z-index` of the menu layer.
   * @default 99999
   */
  zIndex?: number;
}

/**
 * Floating menu rendered in a portal and positioned with Floating UI.
 * Closes on outside click and Escape, and locks body scroll while open.
 *
 * Use it either with a `trigger` (uncontrolled or controlled) or with a
 * `reference` plus controlled `open`.
 *
 * @example
 * // Trigger button
 * <Dropdown trigger={<Button size="sm">Menu</Button>}>
 *   <MenuItems />
 * </Dropdown>
 *
 * @example
 * // Open at a custom position
 * const [open, setOpen] = useState(false);
 * const [rect, setRect] = useState<DOMRect | null>(null);
 *
 * <button
 *   onClick={(e) => {
 *     setRect(e.currentTarget.getBoundingClientRect());
 *     setOpen(true);
 *   }}
 * />
 * <Dropdown
 *   open={open}
 *   onOpenChange={setOpen}
 *   reference={rect ? { getBoundingClientRect: () => rect } : null}
 * >
 *   <MenuItems />
 * </Dropdown>
 */
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

'use client';

import clsx from 'clsx';
import {
  Children,
  useCallback,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export interface MenuWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const MenuWrapperRoot = ({
  className,
  children,
  ...rest
}: MenuWrapperProps) => {
  return (
    <div
      data-komc
      className={clsx(
        'komc:absolute komc:top-1 komc:right-1 komc:z-45',
        'komc:flex komc:flex-row komc:items-center komc:gap-2',
        'komc:rounded-sm komc:bg-neutral-50 komc:p-0.5 komc:px-1',
        'komc:drop-shadow-sm',
        'komc:opacity-0 komc:transition-all komc:duration-200 komc:ease-in-out',
        'komc:group-hover:opacity-100',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface MenuWrapperItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const MenuWrapperItem = ({
  active = false,
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: MenuWrapperItemProps) => {
  return (
    <button
      type="button"
      className={clsx(
        'komc:flex komc:h-4 komc:w-4 komc:shrink-0 komc:cursor-pointer',
        'komc:items-center komc:justify-center komc:rounded-sm komc:p-3',
        'komc:hover:bg-neutral-100',
        active ? 'komc-active komc:text-orange-500' : 'komc:text-neutral-900',
        className,
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export interface MenuWrapperPanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const MenuWrapperPanel = ({
  className,
  children,
  ...rest
}: MenuWrapperPanelProps) => {
  const content = Children.toArray(children).filter(Boolean);

  if (content.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'komc:absolute komc:top-8 komc:left-0 komc:w-full',
        className,
      )}
      {...rest}
    >
      {content}
    </div>
  );
};

export const useMenuPanel = <K extends string = string>(
  initial: K | null = null,
) => {
  const [activeKey, setActiveKey] = useState<K | null>(initial);

  const toggle = useCallback((key: K) => {
    setActiveKey((current) => (current === key ? null : key));
  }, []);

  return { activeKey, toggle, setActiveKey };
};

export const MenuWrapper = Object.assign(MenuWrapperRoot, {
  Item: MenuWrapperItem,
  Panel: MenuWrapperPanel,
});

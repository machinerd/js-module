import clsx from 'clsx';

export interface TooltipTriggerProps {
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
}

export default function TooltipTrigger({ children, setOpen }: TooltipTriggerProps) {
  return (
    <div
      className={clsx(
        'komc:inline-flex komc:shrink-0 komc:justify-center komc:items-center',
        'komc:bg-transparent komc:border-none komc:outline-none',
        'komc:p-0 komc:m-0 komc:box-border',
      )}
      onMouseLeave={() => setOpen(false)}
      onMouseOver={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen(true)}
    >
      {children}
    </div>
  );
}

import { ComponentProps } from 'react';
import Button from '../button/button';

export default function PreserveFocusButton({
  className,
  onMouseDown,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
    />
  );
}

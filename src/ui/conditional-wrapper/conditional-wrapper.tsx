export interface ConditionalWrapperProps {
  /** When `true`, `children` is passed through `wrapper`. */
  condition: boolean;
  /** Wraps `children`. Called only when `condition` is `true`. */
  wrapper: (children: React.ReactNode) => React.ReactNode;
  /** Content that is always rendered, wrapped or not. */
  children: React.ReactNode;
}

/**
 * Wraps `children` with `wrapper` only when `condition` is `true`;
 * otherwise renders `children` as-is.
 *
 * For a different wrapper in each case, use `ConditionalEitherWrapper`.
 *
 * @example
 * <ConditionalWrapper
 *   condition={Boolean(href)}
 *   wrapper={(children) => <a href={href}>{children}</a>}
 * >
 *   <Card />
 * </ConditionalWrapper>
 */
export default function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) {
  if (condition) {
    return wrapper(children);
  }
  return children;
}

export interface ConditionalEitherWrapperProps {
  /** Chooses which wrapper is used. */
  condition: boolean;
  /** Wraps `children` when `condition` is `true`. */
  trueWrapper: (children: React.ReactNode) => React.ReactNode;
  /** Wraps `children` when `condition` is `false`. */
  falseWrapper: (children: React.ReactNode) => React.ReactNode;
  /** Content passed to the chosen wrapper. */
  children: React.ReactNode;
}

/**
 * Wraps `children` with `trueWrapper` or `falseWrapper` depending on
 * `condition`.
 *
 * To wrap only in one case, use `ConditionalWrapper`.
 *
 * @example
 * <ConditionalEitherWrapper
 *   condition={isExternal}
 *   trueWrapper={(children) => <a href={url} target="_blank">{children}</a>}
 *   falseWrapper={(children) => <Link href={url}>{children}</Link>}
 * >
 *   Open
 * </ConditionalEitherWrapper>
 */
export default function ConditionalEitherWrapper({
  condition,
  trueWrapper,
  falseWrapper,
  children,
}: ConditionalEitherWrapperProps) {
  if (condition) {
    return trueWrapper(children);
  }
  return falseWrapper(children);
}

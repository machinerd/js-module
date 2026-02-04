export interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

/**
 * @param condition - Condition to wrap the children
 * @param wrapper - Wrapper function
 * @param children - Children to wrap
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

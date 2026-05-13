export interface ConditionalEitherWrapperProps {
  condition: boolean;
  trueWrapper: (children: React.ReactNode) => React.ReactNode;
  falseWrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

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

import React, { ReactNode, ReactElement } from "react";

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactElement;
  children: ReactNode;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  condition,
  wrapper,
  children,
}) => (condition ? wrapper(children) : children);

export default ConditionalWrapper;

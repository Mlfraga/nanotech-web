import React from 'react';

import { Container } from './styles';

interface IToolTipProps {
  title: string;
  className?: string;
}

const ToolTip: React.FC<IToolTipProps> = ({ className, title, children }) => (
  <Container className={className}>
    {children}
    <span>{title}</span>
  </Container>
);

export default ToolTip;

import React from 'react';

import Menu from '../Menu';
import { LayoutContainer, PageContainer } from './styles';

interface ILayoutProps {}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Menu />
      <PageContainer>{children}</PageContainer>
    </LayoutContainer>
  );
};

export default Layout;

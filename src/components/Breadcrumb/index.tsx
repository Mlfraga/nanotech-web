import React from 'react';

import { Container, Title } from './styles';

interface IBreaadCrumbProps {
  text: string;
  filterButton?: JSX.Element;
}

const Breadcrumb: React.FC<IBreaadCrumbProps> = ({ text, filterButton }) => (
  <Container
    width="100%"
    maxWidth="90vw"
    display="flex"
    marginLeft="auto"
    marginRight="auto"
    padding="0px 0px 26px 8px"
    borderRadius="md"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    fontWeight="bold"
    borderBottom="1px solid #505050"
  >
    <Title>{text}</Title>

    {filterButton}
  </Container>
);

export default Breadcrumb;

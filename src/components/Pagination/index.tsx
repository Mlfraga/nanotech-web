/* eslint-disable react/no-array-index-key */
import React from 'react';

import { BoxProps } from '@chakra-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import { Container } from './styles';

interface IPaginationProps extends BoxProps {
  total_pages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const IPagination: React.FC<IPaginationProps> = ({
  total_pages,
  page,
  setPage,
  ...rest
}) => (
  <Container
    backgroundColor="#303030"
    width="100%"
    color="#eee"
    display="flex"
    padding="15px"
    height="50px"
    borderRadius="15px"
    fontWeight="bold"
    justifyContent="center"
    alignItems="center"
    {...rest}
  >
    <Pagination
      count={total_pages + 1}
      page={page + 1}
      onChange={(_e, j) => setPage(j - 1)}
    />
  </Container>
);

export default IPagination;

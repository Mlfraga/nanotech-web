/* eslint-disable react/no-array-index-key */
import React from 'react';

import Pagination from '@material-ui/lab/Pagination';

import { Container } from './styles';

interface IPaginationProps {
  total_pages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const IPagination: React.FC<IPaginationProps> = ({
  total_pages,
  page,
  setPage,
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
  >
    <Pagination
      count={total_pages + 1}
      page={page + 1}
      onChange={(_e, j) => setPage(j - 1)}
    />
  </Container>
);

export default IPagination;

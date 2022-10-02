import { Flex as ChakraFlex } from '@chakra-ui/core';
import styled from 'styled-components';

export const Container = styled(ChakraFlex)`
  /* @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap'); */
  height: 100%;
  flex-direction: column;

  @media (min-width: 1224px) {
    padding-left: 80px;
    padding-top: 45px;
  }
`;
export const Content = styled(ChakraFlex)``;

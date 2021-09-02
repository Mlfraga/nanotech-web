import { Box as ChakraBox, Flex } from '@chakra-ui/core';
import styled from 'styled-components';

export const InputContainer = styled(Flex)`
  width: 100%;
  max-width: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 12px;
`;

export const Content = styled(Flex)`
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const ButtonsContainer = styled(Flex)`
  max-width: 400px;
  width: 100%;

  button {
    background: transparent;
    border: 2px solid #355a9d;

    & + button {
      border: 0px;
      margin-left: 12px;
      background-color: #355a9d;
    }
  }
`;

export const Container = styled(ChakraBox)`
  /* @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap'); */
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: '#444242';
`;

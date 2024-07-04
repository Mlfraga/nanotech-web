import { Flex } from '@chakra-ui/core';
import styled from 'styled-components';

export const InputContainer = styled(Flex)`
  width: 100%;

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
  width: 100%;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px){
    flex-direction: row;
  }

  button {
    border: 2px solid #355a9d;
  }
`;

export const Container = styled(Flex)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

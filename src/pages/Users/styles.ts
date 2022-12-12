import { Box as ChakraBox } from '@chakra-ui/core';
import styled from 'styled-components';

export const Container = styled(ChakraBox)`
  /* @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap'); */

  @media (min-width: 1224px) {
    padding-left: 80px;
    padding-top: 45px;
  }
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 22% 16% 22% 16% 8% 10%;
  min-width: 800px;
  gap: 6px;
  align-items: center;
  justify-content: center;

  padding-left: 10px;
  padding-right: 10px;

  margin-top: 12px;
  background: #282828;
  height: 60px;
  border-radius: 15px;

  span {
    font: 16px 'Ubuntu', sans-serif;
    font-weight: bold;
  }
`;

export const InputsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5rem;
  width: 100%;
`;

export const Separator = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 14px;

  span {
    font: 20px 'Ubuntu', sans-serif;
    font-weight: bold;
    color: #eee;
  }

  div {
    height: 2px;
    flex: 1;

    background: #686868;
    margin-left: 10px;
    margin-top: 3px;
  }
`;

export const List = styled(ChakraBox)`
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 800px;

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #282828;
    border-radius: 10px;
  }
`;

export const Row = styled(ChakraBox)`
  width: 100%;

  padding-left: 10px;

  padding-right: 10px;
  display: grid;

  width: 100%;
  grid-template-columns: 22% 16% 22% 16% 8% 10%;
  gap: 6px;
  align-items: center;

  justify-content: center;

  background: #303030;
  height: 60px;
  border-radius: 15px 15px 0 0;

  span {
    display: flex;
    align-items: center;
    font: 15px 'Ubuntu', sans-serif;
    font-weight: 200;
    overflow-wrap: anywhere;

    div {
      margin-right: 6px;
      border-radius: 50%;
      width: 12px;
      height: 12px;
    }
  }

  & + div {
    margin-top: 16px;
  }
`;

export const ActionButttonsContainer = styled.div`
  display: flex;
  gap: 6px;
`;

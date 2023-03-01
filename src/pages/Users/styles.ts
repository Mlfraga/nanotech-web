import { Box as ChakraBox } from '@chakra-ui/core';
import styled from 'styled-components';

export const Container = styled(ChakraBox)`
  /* @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap'); */
  height: 100%;
  max-height: 100vh;

  @media (min-width: 1224px) {
    padding-left: 80px;
    padding-top: 25px;
  }
`;

export const Content = styled(ChakraBox)`
  .boxTitle {
    min-width: 800px;
    display: grid;
    grid-template-columns: 15% 20% 20% 20% 10% 10%;
    align-items: center;
    justify-content: center;

    margin-top: 12px;
    background: #282828;
    height: 60px;
    border-radius: 15px;

    span {
      font: 16px 'Ubuntu', sans-serif;
      font-weight: bold;
    }
  }
`;

export const ButtonContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 90vw;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const Separator = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 25px;

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
  min-width: 800px;
  width: 100%;

  overflow-x: hidden;
  overflow-y: auto;

  margin-top: 16px;

  ::-webkit-scrollbar {
    width: 6px;
    background: #383838;
  }

  ::-webkit-scrollbar-thumb {
    background: #525252;
    border-radius: 20px;
  }

  div + div {
    margin-top: 12px;
  }
`;

export const Row = styled.div`
  display: grid;
  position: relative;
  width: 100%;
  grid-template-columns: 15% 20% 20% 20% 10% 10%;
  align-items: center;
  justify-content: center;

  background: #303030;
  height: 60px;
  border-radius: 16px
`;

export const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button + button {
    margin-left: 8px;
  }
`;

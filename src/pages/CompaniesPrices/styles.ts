import { Box as ChakraBox } from '@chakra-ui/core';
import styled from 'styled-components';

export const Container = styled(ChakraBox)`
  height: 100%;
  max-height: 100vh;

  @media (min-width: 1224px) {
    padding-left: 80px;
    padding-top: 25px;
  }
`;

export const Content = styled(ChakraBox)`
  .boxTitle {
    display: grid;
    grid-template-columns: 30% 20% 20% 10% 10%;
    align-items: center;
    justify-content: center;

    margin-top: 25px;
    background: #282828;
    height: 60px;
    border-radius: 15px;

    span {
      font: 16px 'Ubuntu', sans-serif;
      font-weight: bold;
    }
  }

  .button {
    margin-top: 30px;
    float: right;
    width: 300px;
  }
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
  width: 100%;
  height: 550px;
  overflow: auto;
  margin-top: 16px;

  ::-webkit-scrollbar {
    width: 6px;
    background: #383838;
  }

  ::-webkit-scrollbar-thumb {
    background: #525252;
    border-radius: 20px;
  }
`;

export const Box = styled.div`
  display: grid;
  grid-template-columns: 30% 20% 20% 10% 10%;
  align-items: center;
  justify-content: center;

  background: #303030;
  height: 60px;
  border-radius: 15px;

  & + div {
    margin-top: 16px;
  }
  span {
    display: flex;
    align-items: center;
    font: 15px 'Ubuntu', sans-serif;
    font-weight: 400;

    div.unabled {
      margin-right: 8px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff6f60;
    }

    div.enabled {
      margin-right: 8px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #94ec94;
    }
  }

  span {
    font: 15px 'Ubuntu', sans-serif;
    font-weight: 400;
  }
`;

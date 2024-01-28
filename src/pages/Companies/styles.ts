import { Box as ChakraBox } from '@chakra-ui/core';
import styled from 'styled-components';

export const Container = styled(ChakraBox)`
  /* @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap'); */
  height: 100%;
  max-height: 100vh;

`;

export const Content = styled(ChakraBox)`
  .boxTitle {
    min-width: 800px;
    display: grid;
    grid-template-columns: 15% 20% 20% 45%;
    align-items: center;
    justify-content: center;
    padding-left: 10px;

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
`;

export const Box = styled.div`
  & + div {
    margin-top: 16px;
  }

  div.header {
    padding-left: 10px;
    display: grid;
    width: 100%;
    grid-template-columns: 15% 20% 20% 10% 20% 15%;
    align-items: center;
    justify-content: center;

    background: #303030;
    height: 60px;
    border-radius: 15px 15px 0 0;

    span {
      display: flex;
      align-items: center;
      font: 15px 'Ubuntu', sans-serif;
      font-weight: 400;
      div {
        margin-right: 6px;
        border-radius: 50%;
        width: 12px;
        height: 12px;
      }
    }
  }

  .dropDown {
    background: #353535;
    border-radius: 0 0 15px 15px;
    padding: 10px 16px 20px 16px;

    .createNewCompanyLink {
      display: flex;
      align-items: center;
      text-decoration: none;

      font: 14px 'Ubuntu', sans-serif;
      font-weight: 400;

      color: #355a9d;
      transition: color 0.2s;

      margin-top: 16px;
      &:hover {
        color: #5580b9;
      }
    }

    div.separator {
      margin-top: 5px;
      span {
        font: 16px 'Ubuntu', sans-serif;
      }
    }

    div.title {
      margin-top: 16px;
      background: #424242;
      min-height: 35px;
      border-radius: 8px;
      padding-left: 26px;

      display: grid;
      grid-template-columns: 30% 30% 10% 30%;
      align-items: center;

      & + div {
        margin-top: 8px;
      }

      span {
        font: 16px 'Ubuntu', sans-serif;
        font-weight: bold;
      }
    }

    div.unit {
      margin-top: 16px;
      background: #424242;
      min-height: 35px;
      border-radius: 8px;
      padding-left: 26px;

      display: grid;
      grid-template-columns: 30% 30% 10% 30%;
      align-items: center;
      & + div {
        margin-top: 8px;
      }
    }
  }
`;

export const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button + button {
    margin-left: 8px;
  }
`;

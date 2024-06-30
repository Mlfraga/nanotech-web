import { Box as ChakraBox } from '@chakra-ui/core';
import styled from 'styled-components';

export const Container = styled(ChakraBox)`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Content = styled(ChakraBox)`
  .boxTitle {
    min-width: 800px;
    display: grid;
    grid-template-columns: 30% 56% 10%;
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
  grid-template-columns: 30% 56% 10%;
  align-items: center;
  justify-content: center;

  background: #303030;
  min-height: 60px;
  padding: 12px;
  border-radius: 16px;
`;

export const Column = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0px !important;
`;

const randomCompanyStampColor: { [k: number]: { bg: string; color: string } } = {
  0: { bg: '#f4a261', color: '#000000' }, // Laranja claro
  1: { bg: '#2a9d8f', color: '#ffffff' }, // Verde água
  2: { bg: '#e76f51', color: '#ffffff' }, // Vermelho claro
  3: { bg: '#264653', color: '#ffffff' }, // Azul escuro
  4: { bg: '#e9c46a', color: '#000000' }, // Amarelo mostarda
  5: { bg: '#f4a261', color: '#000000' }, // Laranja claro
  6: { bg: '#2a9d8f', color: '#ffffff' }, // Verde água
  7: { bg: '#e76f51', color: '#ffffff' }, // Vermelho claro
  8: { bg: '#264653', color: '#ffffff' }, // Azul escuro
  9: { bg: '#e9c46a', color: '#000000' }, // Amarelo mostarda
};

interface CompanyStampProps {
  rand: number;
}

export const CompanyStamp = styled.div<CompanyStampProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => randomCompanyStampColor[props.rand].bg};
  color: ${props => randomCompanyStampColor[props.rand].color};
  border-radius: 6px;
  border: 1px solid #282828;
  padding: 8px;
  font: 12px 'Ubuntu', sans-serif;
  font-weight: bold;
  margin: 0px !important;
  cursor: pointer;
  transition: background 0.2s;
`;

export const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button + button {
    margin-left: 8px;
  }
`;

import { Box as ChakraBox } from '@chakra-ui/core';
import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 1224px) {
    padding-left: 80px;
    padding-top: 25px;
  }

  .boxTitle {
    min-width: 1000px;
    display: grid;
    grid-template-columns:  16.66% 16.66% 16.66% 16.66% 16.66% 16.66%;
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
  }

  .serviceName{
    gap: 10px
  }

  .boxSales {
    min-width: 1000px;
    display: grid;
    grid-template-columns: 16.66% 16.66% 16.66% 16.66% 16.66% 16.66%;
    align-items: center;
    justify-content: center;


    /* /* margin-top: 12px;
    background: #282828;
    height: 60px;
    border-radius: 15px; */

    span {
      font: 16px 'Ubuntu', sans-serif;
      /* font-weight: bold; */
    }
  }


  div.updateSaleContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    span {
      margin-top: 12px;
      margin-bottom: 12px;
      /* font-weight: bold;
      font-size: 18px; */
    }
  }
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
  ::-webkit-scrollbar {
    width: 6px;
    background: #383838;
  }

  ::-webkit-scrollbar-thumb {
    background: #525252;
    border-radius: 20px;
  }
`;

export const ListHeader = styled.div`
  min-width: 900px;

  display: grid;
  grid-template-columns: 18% 10% 24% 18% 12% 14%;
  align-items: center;
  justify-content: center;
  padding-left: 10px;

  margin-top: 12px;
  background: #282828;
  height: 60px;
  border-radius: 15px;

  span {
    font: 16px 'Ubuntu', sans-serif;
    overflow-wrap: anywhere;
    font-weight: bold;
  }
`;

export const ListRow = styled.div`
  min-width: 900px;

  border-radius: 16px 16px 0 0;

  padding-left: 10px;
  display: grid;
  width: 100%;
  grid-template-columns: 18% 10% 24% 18% 12% 14%;
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
`;

export const ServiceInfos = styled.div`
  min-width: 900px;

  width: 100%;
  background: #353535;
  border-radius: 0 0 15px 15px;
  padding: 10px 16px 20px 16px;
`;

export const ServiceItem = styled.div`
  width: 100%;
  background: #303030;
  border-radius: 8px;
  padding: 8px;
  margin-top: 8px;
`;

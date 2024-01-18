import {
  Box as ChakraBox,
  Flex as ChakraFlex,
  Grid as ChakraGrid
} from '@chakra-ui/core';
import { shade } from 'polished';
import styled from 'styled-components';

export const ServicesContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 26px;
  flex-wrap: wrap;
  padding-top: 1rem;
`;

export const ServicesHeading = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SelectServicesTitle = styled.h1`
  font-size: 1.5rem;
  font-family: 'Ubuntu';
  margin: 0px;
  font-weight: 600;
  color: #eee;
  `;

export const SelectServicesSubtitle = styled.h2`
  font-size: 0.8rem;
  margin-top: 2px;
  font-family: 'Inter';
  font-weight: 400;
  color: #c3bebe;
`;

export const SearchContainer = styled.div`
  min-width: 38%;
`;

export const Services = styled.div`
  width: 100%;
  margin-top: 10px;
  gap: 1rem;
  display: flex;
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1068px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .selected {
    border-color: #5580b9;
  }
`;

export const ServiceBox = styled(ChakraFlex)`
  word-break: break-word;
  background: #424242;
  border: 2px solid #555555;

  display: flex;
  flex: 1;
  gap: 8px;
  justify-content: space-between;
  border-radius: 8px;
  cursor: pointer;
  padding: 12px;

  transition: background-color 0.2s;
  :hover {
    background: ${shade(0.2, '#424242')};
  }
`;

export const ServicePriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ServiceDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ServiceTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #eee;
  padding: 0px;
  margin-bottom: 4px;
`;

export const ServicePrice = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: #34D399;
  min-width: 100px;
  text-align: right;
`;

export const ServiceDescription = styled.span`
  font-size: 10 px;
  color: #acacac;
  padding: 0px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  margin-top: auto;

  button {
    margin: 0px;
  }

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

import {
  Flex as ChakraFlex,
} from '@chakra-ui/core';
import { shade } from 'polished';
import styled from 'styled-components';

export const OrderSummaryContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 26px;
  flex-wrap: wrap;
  padding-top: 1rem;
`;

export const Heading = styled.div`
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

export const Content = styled.div`
  img {
    display: none;
  }

  width: 100%;
  gap: 16px;

  @media (min-width: 780px) {
    display: flex;

    img {
      width: 40%;
      display: block;
    }
  }
`;

export const OrderSummaryTitle = styled.h1`
  font-size: 1.5rem;
  font-family: 'Ubuntu';
  margin: 0px;
  font-weight: 600;
  color: #eee;
  `;

export const OrderSummarySubtitle = styled.h2`
  font-size: 0.8rem;
  margin-top: 2px;
  font-family: 'Inter';
  font-weight: 400;
  color: #c3bebe;
`;

export const OrderSummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 8px;
  background-color: #303030;
`;

export const OrderHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  border-radius: 8px 8px 0px 0px;
`;

export const HeaderKey = styled.span`
  font-family: 'Inter';
  font-weight: 500;
  font-size: 0.8rem;
  color: #919090;
  width: 100%;
  overflow-wrap: break-word;
`;

export const HeaderInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #4f4f4f;
  padding-bottom: 6px;
  gap: 4px;


  &:last-child,
  &:nth-last-child(2):first-child {
    border-bottom: none;
  }
`;

export const HeaderInfoRow = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
`;

export const HeaderInfoValue = styled.span`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 0.8rem;
  overflow-wrap: break-word;
  color: #e1e1e1;
  width: 100%;
`;

export const OrderServicesSection = styled.section`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 16px;
  border-top: 1px solid #4f4f4f;
`;

export const SericesDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  gap: 8px;
`;

export const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
  border-bottom: 1px solid #4f4f4f;
  padding-bottom: 8px;

  &:last-child {
    border-bottom: none;
  }
`;

export const ServiceName = styled.span`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 0.9rem;
  overflow-wrap: break-word;
  color: #e1e1e1;
`;

export const ServicePrice = styled.span`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 1rem;
  overflow-wrap: break-word;
  color: #34D399;
`;

export const ServiceTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 6px;
`;

export const ServiceTotalLabel = styled.span`
  font-family: 'Inter';
  font-weight: 600;
  font-size: 1rem;
  overflow-wrap: break-word;
  color: #e1e1e1;
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

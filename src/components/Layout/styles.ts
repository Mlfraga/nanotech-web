import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  min-height: 100vh;
  gap: 16px;
`;

export const PageContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 16px;

  @media (min-width: 900px){
    margin-left: 80px;
  }
`;

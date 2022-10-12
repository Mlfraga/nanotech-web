import styled from 'styled-components';

export const Box = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleBox = styled.h1`
  font: 16px 'Ubuntu', sans-serif;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TextBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  span {
    font: 14px 'Ubuntu', sans-serif;
  }
`;

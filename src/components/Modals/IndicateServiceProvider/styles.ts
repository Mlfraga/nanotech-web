import styled from 'styled-components';

export const Box = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font: 17px 'Ubuntu', sans-serif;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Text = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  span {
    font: 16px 'Ubuntu', sans-serif;
  }
`;

export const ChipContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ChipBox = styled.div`
  padding: 5px;
`;

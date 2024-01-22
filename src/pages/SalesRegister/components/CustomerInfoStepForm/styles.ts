import styled from 'styled-components';

export const CustomerInfosContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 26px;
  flex-wrap: wrap;
  padding-top: 3rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  width: 100%;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 160px;
  width: 100%;

  div {
    height: 30px;
    border-radius: 6px;
    background: #424242;

    div {
      background: #424242;
      border: 0;
      height: 26px;
    }
  }
`;

export const Label = styled.label`
  font: 14px 'Ubuntu', sans-serif;
  font-weight: 500;
  color: #eee;
  margin-bottom: 8px;
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

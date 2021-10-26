import styled from 'styled-components';

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  width: 100%;
`;

export const InputContainer = styled.div`
  margin-top: 0px;
  display: flex;
  flex-direction: column;

  div {
    height: 3.2rem;
  }

  .MuiFormControl-root.MuiTextField-root.date-times {
    max-width: 1000px !important;
  }

  .MuiInputBase-input {
    background: #1c1c1c !important;
  }
`;

export const Label = styled.span`
  margin-left: 6px;
  margin-bottom: 8px;
  font-size: 16px;
`;

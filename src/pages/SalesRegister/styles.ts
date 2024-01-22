import {
  Box as ChakraBox,
  Flex as ChakraFlex,
  Grid as ChakraGrid
} from '@chakra-ui/core';
import { Form } from '@unform/web';
import { shade } from 'polished';
import styled from 'styled-components';

export const RegisterSuccessPage = styled.div`
  width: 100%;
  height: 100vh;
  background: #252525;

  .content {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    svg {
      margin-bottom: 80px;
    }
    h1 {
      margin-bottom: 30px;
    }

    .buttons {
      width: 250px;
      display: flex;

      button {
        & + button {
          margin-left: 16px;
        }
      }
    }
  }
`;

export const Container = styled.div`
  /* @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap'); */

  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  textarea::placeholder {
    color: #fff;
  }

  .buttons_container {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 12px;

    button {
      width: 250px;
      margin-left: 16px;
    }
  }
`;

export const StyledForm = styled(Form)`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
`;

export const FormStepsContainer = styled.div`
  display: flex;
  gap: 1.4rem;
  width: 100%;

  @media(min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;


interface FormStepProps {
  active?: boolean;
}

export const FormStep = styled.button<FormStepProps>`
  background-color: #424242;
  ${({ active }) => (active ? 'background: #355a9d;' : '')}
  border-radius: 16px;
  padding: 8px;
  width: 2rem;
  height: 2rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;

  @media (min-width: 768px) {
    padding: 8px;
    border-radius: 16px;
    width: auto;
    height: auto;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormStepNumberTitle = styled.span`
  font: 14px 'Ubuntu', sans-serif;
  font-weight: bold;
  color: #eee;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

export const FormStepTitle = styled.span`
  font: 8px 'Ubuntu', sans-serif;
  font-weight: bold;
  color: #eee;
  position: absolute;
  top: 110%;

  @media (min-width: 768px) {
    font-size: 16px;
    position: relative;
    color: #d2d2d2;
  }
`;

export const Separator = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 16px;

  span {
    font: 18px 'Ubuntu', sans-serif;
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

export const FormSectionTitle = styled.h1`
  font: 18px 'Ubuntu', sans-serif;
  font-weight: bold;
  color: #eee;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
`;

export const CompanyInfosContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 26px;
  flex-wrap: wrap;
  width: 100%;
`;

export const Label = styled.label`
  font: 14px 'Ubuntu', sans-serif;
  font-weight: 500;
  color: #eee;
  margin-bottom: 8px;
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 180px;
  width: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 180px;
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

export const DateTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 160px;
`;

export const Services = styled(ChakraGrid)`
  width: 100%;
  margin-top: 10px;
  gap: 18px;
  grid-template-columns: 20% 20% 20% 20% 20%;

  .selected {
    border-color: #5580b9;
  }
`;

export const ServiceBox = styled(ChakraFlex)`
  min-height: 75px;
  word-break: break-word;
  background: #424242;
  border: 2px solid #555555;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;

  transition: background-color 0.2s;
  :hover {
    background: ${shade(0.2, '#424242')};
  }

  span {
    font-size: 16px;
    text-align: center;
    padding: 5px 5px;
  }
`;

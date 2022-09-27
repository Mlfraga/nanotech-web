import NumberFormat from 'react-number-format';

import { Stack } from '@chakra-ui/core';
import styled from 'styled-components';

export const TelephoneField = styled(NumberFormat)`
  padding: 4px;
  background-color: #383838;
  color: #eee;

  width: 100%;
  height: 40px;
  margin-right: 16px;

  padding: 6px;
  border: 1px solid #282828;
  border-radius: 6px;

  :hover {
    border: 1px solid #cbd5e0;
  }
`;

export const StyledStack = styled(Stack)`
  div.numbers-list {
    ::-webkit-scrollbar {
      width: 8px;
      background-color: #383838;
      border-radius: 6px;
    }
    ::-webkit-scrollbar-thumb {
      width: 4px;
      background-color: #282828;
      border-radius: 6px;
    }
  }
`;

export const AddNumberButton = styled.button`
  border: 0;
  background: transparent;
  color: #3182ce;
  font-size: 18px;
`;

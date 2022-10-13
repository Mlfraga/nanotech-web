import { Chip } from '@material-ui/core';
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

export const CustomChip = styled(Chip)`
  svg {
    color: #585858;
  }
`;

export const Content = styled.div`
  .MuiInputLabel {
    color: #fff;
    margin: 0px;
    margin-left: 6px;
    position: relative;
  }

  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 0px solid #000;
  }

  .MuiInput-underline:before {
    border-bottom: 0px solid #000;
  }

  .MuiInput-underline:after {
    border-bottom: 0px solid #355a9d;
  }

  label + .MuiInput-formControl {
    margin-top: 0px;
  }
`;

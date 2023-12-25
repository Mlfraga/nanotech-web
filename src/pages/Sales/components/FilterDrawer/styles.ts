import styled from 'styled-components';
import Input from '../../../../components/Input';

export const Container = styled.div``;

export const DescriptionLabel = styled.span`
  font-size: 16px;
`;

export const RowWithTwoFieldsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 6px;
`;

export const Row = styled.div`
  display: flex;
`;

export const InputStyled = styled(Input)`
  &::placeholder {
    color: #fff !important;
  }
  color: #fff !important;
  font-size: 1rem !important;
`

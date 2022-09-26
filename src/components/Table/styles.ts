import styled from 'styled-components';

type TableProps = {
  numOfColumns: number;
};

export const TableContainer = styled.div``;

export const TableHeader = styled.div<TableProps>`
  display: grid;
  grid-template-columns: repeat(${({ numOfColumns }) => numOfColumns}, 1fr);
  align-items: center;
  justify-content: center;

  margin-top: 25px;
  margin-top: 25px;
  padding: 16px;

  background: #282828;

  height: 60px;

  border-radius: 16px;
`;

export const HeaderText = styled.span``;

export const TableBody = styled.div``;

export const Row = styled.div<TableProps>`
  padding: 16px;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${({ numOfColumns }) => numOfColumns}, 1fr);
  align-items: center;
  justify-content: center;

  background: #303030;
  height: 60px;
  border-radius: 16px;

  margin-top: 16px;
`;

export const RowCell = styled.div``;

export const DefaultRowText = styled.span`
  font: 16px 'Ubuntu', sans-serif;
  color: #e2e8f0;
`;

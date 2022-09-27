import React from 'react';

import {
  TableContainer,
  TableHeader,
  HeaderText,
  TableBody,
  Row,
  RowCell,
  DefaultRowText,
} from './styles';

interface IColumn {
  name: string;
  field: string;
  id: number;
}

export interface IRow {
  id: string;
  [key: string]: string | JSX.Element;
}

type TableProps = {
  columns: IColumn[];
  data: IRow[];
};

const Table = ({ columns, data }: TableProps) => (
  <TableContainer>
    <TableHeader numOfColumns={columns.length}>
      {columns.map(column => (
        <HeaderText key={column.id}>{column.name}</HeaderText>
      ))}
    </TableHeader>

    <TableBody>
      {data.map(row => (
        <Row numOfColumns={columns.length} key={row.id}>
          {columns.map(column => (
            <RowCell key={column.id}>
              {typeof row[column.field] === 'string' ? (
                <DefaultRowText>{row[column.field]}</DefaultRowText>
              ) : (
                row[column.field]
              )}
            </RowCell>
          ))}
        </Row>
      ))}
    </TableBody>
  </TableContainer>
);

export default Table;

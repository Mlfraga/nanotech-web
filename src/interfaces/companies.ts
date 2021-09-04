import { IFormattedUnit, IUnit } from './unit';

export interface ICompany {
  id: number;
  name: string;
  telephone: string;
  cnpj: string;
  client_identifier: string;
  unities: Array<IUnit>;
}

export interface IFormattedCompany {
  id: number;
  name: string;
  telephone: string;
  cnpj: string;
  client_identifier: string;
  buttons: JSX.Element;
  units: Array<IFormattedUnit>;
}

import { IFormattedUnit, IUnit } from './unit';

export interface ICompany {
  id: string;
  name: string;
  telephone: string;
  cnpj: string;
  client_identifier: string;
  unities: Array<IUnit>;
}

export interface IFormattedCompany {
  id: string;
  name: string;
  telephone: string;
  cnpj: string;
  client_identifier: string;
  buttons: JSX.Element;
  units: Array<IFormattedUnit>;
}

export interface IUnit {
  id: number;
  name: string;
  telephone: string;
  client_identifier: string;
}
export interface IFormattedUnit {
  id: number;
  name: string;
  telephone: string;
  client_identifier: string;
  button: JSX.Element;
}

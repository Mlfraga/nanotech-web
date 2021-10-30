export interface IUnit {
  id: string;
  name: string;
  telephone: string;
  client_identifier: string;
}
export interface IFormattedUnit {
  id: string;
  name: string;
  telephone: string;
  client_identifier: string;
  button: JSX.Element;
}

export interface IUser {
  id: number;
  name: string;
  user: {
    telephone: string;
    id: number;
    role: string;
  };
}

export interface IServiceProvider {
  company: string;
  company_id: string;
  created_at: string;
  id: string;
  name: string;
  unit: string;
  unit_id: string;
  updated_at: string;
  user: {
    created_at: string;
    email: string;
    enabled: boolean;
    first_login: boolean;
    id: string;
    password: string;
    role: string;
    telephone: number;
    updated_at: string;
    username: string;
  };
  user_id: string;
}

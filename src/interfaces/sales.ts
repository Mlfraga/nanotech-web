export interface ISale {
  id: string;
  client_identifier: string;
  availability_date: string;
  delivery_date: string;
  status: string;
  company_value: number;
  cost_value: number;
  comments: string;
  unit: {
    id: string;
    client_identifier: string;
    name: string;
  };
  seller: {
    name: string;
    company: {
      id: string;
      client_identifier: string;
    };
  };
  person: {
    name: string;
  };
  car: {
    brand: string;
    plate: string;
    color: string;
    model: string;
  };
  services_sales: Array<{
    id: string;
    company_value: number;
    cost_value: number;
    service: {
      id: string;
      name: string;
      price: number;
    };
  }>;
  request_date: string;
}

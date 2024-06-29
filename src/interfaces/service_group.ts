export interface IServiceGroup {
  id: string;
  name: string;
  enabled: boolean;
  description: string | undefined;
  image_url: string | undefined;
  companies: {id: string, name: string}[];
}

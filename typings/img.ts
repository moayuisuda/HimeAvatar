export type Img = { seed: string; url: string };
export type MetaData = {
  name: string;
  description: string;
  properties: {
    owner: string;
    id: number;
    seed: number;
  };
  image: string;
};

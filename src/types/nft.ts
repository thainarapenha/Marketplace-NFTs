export interface Nft {
  id: string;
  name: string;
  collection: string;
  price: string;
  gallery: string[];
  description: string;
  editions: string[];
  defaultEdition: string;
  reviews: number;

  attributes: string[];

  details: {
    label: string;
    text: string;
  }[];

  fullDescription: string[];

  features: {
    letter: string;
    title: string;
    text: string;
  }[];

  relatedIds: string[];
}
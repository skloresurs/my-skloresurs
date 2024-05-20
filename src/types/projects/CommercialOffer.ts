export type CommercialOffer = {
  id: string;
  price: number;
  details: CommercialOfferDetail[];
};

export type CommercialOfferDetail = {
  id: number;
  name: string;
  price: number;
  count: number;
  countSuffix: string;
};

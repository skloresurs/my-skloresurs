export type CommercialOffer = {
  id: string;
  price: number;
  comment: string;
  details: CommercialOfferDetail[];
};

export type CommercialOfferDetail = {
  id: number;
  name: string;
  price: number;
  count: number;
  countSuffix: string;
};

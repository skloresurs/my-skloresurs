interface IPlural {
  [key: string]: {
    [key: string]: string;
  };
}

const plurals: IPlural = {
  order: {
    one: "замовлення",
    few: "замовлення",
    many: "замовлень",
  },
  pyramid: {
    one: "піраміда",
    few: "піраміди",
    many: "пірамід",
  },
  session: {
    one: "сесія",
    few: "сесії",
    many: "сесій",
  },
  message: {
    one: "повідомлення",
    few: "повідомлення",
    many: "повідомлень",
  },
};

export default plurals;

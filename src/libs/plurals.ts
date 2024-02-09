interface IPlural {
  [key: string]: {
    [key: string]: string;
  };
}

const plurals: IPlural = {
  order: {
    one: 'замовлення',
    few: 'замовлення',
    many: 'замовлень',
  },
  pyramid: {
    one: 'піраміда',
    few: 'піраміди',
    many: 'пірамід',
  },
  session: {
    one: 'сесія',
    few: 'сесії',
    many: 'сесій',
  },
};

export default plurals;

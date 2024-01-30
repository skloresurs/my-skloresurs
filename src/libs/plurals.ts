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
};

export default plurals;

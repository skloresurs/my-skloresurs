interface IType {
  /**
   * @readonly
   * @type {string}
   * @description Назва типу. Відображається в списку.
   */
  readonly label: string;
  /**
   * @readonly
   * @type {string}
   * @description Значення, яке зберігається в формі. Використовувати ID з 1С.
   */
  readonly value: string;
  /**
   * @readonly
   * @type {number}
   * @description Максимальна кількість груп елементів
   */
  readonly maxElementGroups: number;
  /**
   * @readonly
   * @type {boolean}
   * @description Чи є друга група елементів, потрібно для maxElementGroups
   */
  readonly twoGrops: boolean;
}

const types: IType[] = [
  {
    label: 'МоноСтекло',
    maxElementGroups: 1,
    twoGrops: false,
    value: '62a4c7ff-7a70-485f-9d49-7c00e49855dc',
  },
  {
    label: 'Склопакет',
    maxElementGroups: 9,
    twoGrops: true,
    value: '66859f90-8c4a-4497-bf56-099cdb8c57f4',
  },
  {
    label: 'Триплекс власного виробництва',
    maxElementGroups: 9,
    twoGrops: true,
    value: '7bbda317-6e7b-44a7-8a5d-34a9229e200f',
  },
] as const;

const typeObject = {
  doubleGlazing: types[1].value,
  mono: types[0].value,
  triplex: types[2].value,
} as const;

export default types;
export { typeObject };

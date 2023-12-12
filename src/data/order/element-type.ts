import { typeObject } from './types';

export interface IElementType {
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
   * @type {string[] | undefined}
   * @description Список ID типів для яких цей пункт доступний. Якщо не вказано, то доступно для всіх
   */
  readonly avalibleFor?: string[];
  /**
   * @readonly
   * @type {string[] | undefined}
   * @description Тип зображення
   */
  readonly imageType: 'glass' | 'film' | 'camera';
}

const elementTypes: IElementType[] = [
  {
    imageType: 'glass',
    label: 'Скло сире',
    value: 'b8cdd2b1-c6b4-4692-8d49-119b5413f162',
  },
  {
    avalibleFor: [typeObject.mono, typeObject.doubleGlazing],
    imageType: 'glass',
    label: 'Триплекс заводський',
    value: '8c610873-de4b-43e7-bbdb-d8e37bb882a8',
  },
  {
    avalibleFor: [typeObject.doubleGlazing],
    imageType: 'camera',
    label: 'Гнутєва рамка',
    value: 'f30e2794-e583-47eb-85b9-a9ea9d413767',
  },
  {
    avalibleFor: [typeObject.doubleGlazing],
    imageType: 'camera',
    label: 'Різана рамка',
    value: 'fe386c3c-9f0c-45d1-908f-1c89500f9880',
  },
  {
    avalibleFor: [typeObject.doubleGlazing],
    imageType: 'camera',
    label: 'Тепла рамка',
    value: 'c6dc635c-e640-4728-a843-0a83519de92f',
  },
  {
    avalibleFor: [typeObject.doubleGlazing],
    imageType: 'glass',
    label: 'Триплекс власного виробництва',
    value: typeObject.triplex,
  },
  {
    avalibleFor: [typeObject.doubleGlazing],
    imageType: 'glass',
    label: 'Склопакет',
    value: typeObject.doubleGlazing,
  },
  {
    avalibleFor: [typeObject.triplex],
    imageType: 'film',
    label: 'Плівка для триплекса',
    value: '187527c1-4d9b-442f-8f0a-7ecb475e5d37',
  },
  {
    avalibleFor: [typeObject.triplex],
    imageType: 'film',
    label: 'Плівка для поклейки на триплекс',
    value: '5e53a036-bbd5-11e8-955d-9c8e990dc4ce',
  },
];

export default elementTypes;

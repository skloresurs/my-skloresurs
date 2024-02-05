import { filter, groupBy, reduce, reject } from 'lodash';
import { nanoid } from 'nanoid';

import { IStation } from '@/types/Route';
import IUser1C from '@/types/User1CData';

interface IGroupData {
  id: string;
  order: number;
  time: string;
  address: string;
  addressShort: string;
  contact: IUser1C | null;
  value: IStation[];
}

function group(acc: IGroupData[], value: IStation[]) {
  const v = value[0];
  if (!v) return acc;
  acc.push({
    id: nanoid(),
    order: v.order,
    time: v.time,
    address: v.address,
    addressShort: v.addressShort,
    contact: v.contact,
    value,
  });
  return acc;
}

export default function getGroupedStations(stations: IStation[]) {
  const orderWithoutOrder = reduce(
    groupBy(filter(stations, ['order', 0]), 'addressShort'),
    (acc, value) => group(acc, value),
    [] as IGroupData[]
  );

  return reduce(groupBy(reject(stations, ['order', 0]), 'order'), (acc, value) => group(acc, value), [
    ...orderWithoutOrder,
  ]);
}

export function getStationCount(stations: IStation[]) {
  return getGroupedStations(stations).length;
}

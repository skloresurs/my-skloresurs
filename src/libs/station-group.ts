import { filter, groupBy, reduce, reject } from 'lodash';
import { nanoid } from 'nanoid';

import PersonData from '@/types/1c/User';
import RouteData from '@/types/route/RouteData';

// TODO: Need rewrite

interface IGroupData {
  id: string;
  order: number;
  time: string;
  address: string;
  addressShort: string;
  contact?: PersonData;
  value: RouteData[];
}

function group(acc: IGroupData[], value: RouteData[]) {
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

export default function getGroupedStations(stations: RouteData[]) {
  const orderWithoutOrder = reduce(
    groupBy(filter(stations, ['order', 0]), 'addressShort'),
    (acc, value) => group(acc, value),
    [] as IGroupData[]
  );

  return reduce(groupBy(reject(stations, ['order', 0]), 'order'), (acc, value) => group(acc, value), [
    ...orderWithoutOrder,
  ]);
}

export function getStationCount(stations: RouteData[]) {
  return getGroupedStations(stations).length;
}

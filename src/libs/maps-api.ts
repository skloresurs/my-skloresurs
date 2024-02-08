import { filter, join, lowerCase, map, slice } from 'lodash';

import { removeSymbolsFromString } from './filters';

const GOOGLE_MAPS_ROUTE_API = 'https://www.google.com/maps/dir/?api=1';

const SYMBOLS_FOR_REMOVE = ['№'];

export function getGoogleMapsRouteUrl(waypoints: string[]): string | null {
  const filteredWaypoints = filter(waypoints, (waypoint) => lowerCase(waypoint) !== 'самовивіз');

  if (filteredWaypoints.length === 0) return null;

  const destination = removeSymbolsFromString(filteredWaypoints.at(-1) ?? '', SYMBOLS_FOR_REMOVE);

  if (filteredWaypoints.length === 1) return `${GOOGLE_MAPS_ROUTE_API}&destination=${destination}`;

  const watpointsString = join(
    map(slice(filteredWaypoints, 0, -1), (waypoint) => removeSymbolsFromString(waypoint, SYMBOLS_FOR_REMOVE)),
    '|'
  );

  return `${GOOGLE_MAPS_ROUTE_API}&destination=${destination}&waypoints=${watpointsString}`;
}

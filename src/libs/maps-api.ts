import { filter, join, lowerCase, slice } from 'lodash';

const GOOGLE_MAPS_ROUTE_API = 'https://www.google.com/maps/dir/?api=1';

export function getGoogleMapsRouteUrl(waypoints: string[]): string | null {
  const filteredWaypoints = filter(waypoints, (waypoint) => lowerCase(waypoint) !== 'самовивіз');

  if (filteredWaypoints.length === 0) return null;

  const destination = filteredWaypoints.at(-1);

  if (filteredWaypoints.length === 1) return `${GOOGLE_MAPS_ROUTE_API}&destination=${destination}`;

  const watpointsString = join(slice(filteredWaypoints, 0, -1), '|');

  return `${GOOGLE_MAPS_ROUTE_API}&destination=${destination}&waypoints=${watpointsString}`;
}

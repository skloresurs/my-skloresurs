import { replace } from 'lodash';

// TODO: Move regexp to regexp lib
export function removeSymbolsFromString(string: string, symbols: string[]): string {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return replace(string, new RegExp(`[${symbols.join('')}]`, 'g'), '');
}

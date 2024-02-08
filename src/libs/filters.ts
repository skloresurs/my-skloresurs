import { replace } from 'lodash';

export function removeSymbolsFromString(string: string, symbols: string[]): string {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return replace(string, new RegExp(`[${symbols.join('')}]`, 'g'), '');
}

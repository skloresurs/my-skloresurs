import { isString, startsWith } from 'lodash';
import { mutate } from 'swr';

/**
 * Asynchronously mutates the admin users list.
 *
 * @return {Promise<void>} A promise that resolves once the mutation is complete.
 * @deprecated
 */
export async function mutateAdminUsersList(): Promise<void> {
  await mutate((k) => isString(k) && startsWith(k, '/api/users'), undefined, { revalidate: true });
}

/**
 * Mutates all keys starting with the specified prefix.
 *
 * @param {string} prefix - the prefix to match against keys
 * @return {Promise<void>} a Promise that resolves once the mutation is complete
 */
export async function mutateAllKeysStartingWith(prefix: string): Promise<void> {
  await mutate((k) => isString(k) && startsWith(k, prefix), undefined, { revalidate: true });
}

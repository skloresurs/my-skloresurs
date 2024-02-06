import { isString, startsWith } from 'lodash';
import { mutate } from 'swr';

export async function mutateAdminUsersList() {
  await mutate((k) => isString(k) && startsWith(k, '/api/users'), undefined, { revalidate: false });
}

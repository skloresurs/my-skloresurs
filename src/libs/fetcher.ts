import { nprogress } from '@mantine/nprogress';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

/**
 * An asynchronous function to fetch data from the specified URL.
 *
 * @param {string} url - The URL to fetch data from
 * @return {Promise<unknown>} A promise that resolves to the fetched data
 */
const fetcher = async (url: string): Promise<unknown> => {
  nprogress.start();
  return axios
    .get(url)
    .then((res: AxiosResponse) => res.data)
    .finally(() => nprogress.complete());
};

export default fetcher;

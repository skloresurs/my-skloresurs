import { nprogress } from '@mantine/nprogress';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

const fetcher = async (url: string): Promise<unknown> => {
  nprogress.start();
  return axios
    .get(url)
    .then((res: AxiosResponse) => res.data)
    .finally(() => nprogress.complete());
};

export default fetcher;

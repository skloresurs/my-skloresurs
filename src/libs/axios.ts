import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

import { env } from '@/env.mjs';

const axios1cMain = axios.create({
  baseURL: env.API_URL_1C_MAIN,
  headers: {
    Authorization: env.API_KEY_1C_MAIN,
    'Content-Type': 'application/json',
    'X-Cookie-Auth': 'true',
  },
});

const cachedAxios = setupCache(axios.create());

export default axios1cMain;

export { cachedAxios };

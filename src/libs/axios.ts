import axios from 'axios';

import { env } from '@/env.mjs';

const axios1cMain = axios.create({
  baseURL: env.API_URL_1C_MAIN,
  headers: {
    'Content-Type': 'application/json',
    'X-Cookie-Auth': 'true',
  },
});

const axios1cSecondary = axios.create({
  baseURL: env.API_URL_1C_SECONDARY,
  headers: {
    'Content-Type': 'application/json',
    'X-Cookie-Auth': 'true',
  },
});

export default axios1cMain;
export { axios1cSecondary };

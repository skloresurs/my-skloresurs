import axios from 'axios';

import { env } from '@/env.mjs';

const axios1c = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Cookie-Auth': 'true',
  },
});

export default axios1c;

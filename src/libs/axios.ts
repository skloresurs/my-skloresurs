import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

import { env } from "@/env.mjs";

const axios1cDubno = axios.create({
  baseURL: env.API_URL_1C_MAIN,
  headers: {
    Authorization: env.API_KEY_1C_MAIN,
    "Content-Type": "application/json",
    "X-Cookie-Auth": "true",
  },
});

const axios1cTlymach = axios.create({
  baseURL: "https://example.com",
  headers: {
    Authorization: env.API_KEY_1C_MAIN,
    "Content-Type": "application/json",
    "X-Cookie-Auth": "true",
  },
});

const axios1c = (server: string | null) => {
  if (server === "tlymach") return axios1cTlymach;
  return axios1cDubno;
};

const cachedAxios = setupCache(axios.create());

export default axios1c;

export { cachedAxios };

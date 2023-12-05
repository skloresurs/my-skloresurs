/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable global-require  */
/* eslint-disable unicorn/prefer-module */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: { preflight: false },
  plugins: [require('tailwindcss-animated')],
};
export default config;

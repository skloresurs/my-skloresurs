import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: { preflight: false },
  // eslint-disable-next-line global-require, unicorn/prefer-module
  plugins: [require('tailwindcss-animated')],
};
export default config;

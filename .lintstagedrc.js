module.exports = {
  '*.{js,ts,jsx,tsx,mjs}': 'eslint -f mo --fix',
  '*.{ts,tsx}': 'tsc -p tsconfig.json --noEmit',
  '*.{json,md,css}': 'prettier --write',
};

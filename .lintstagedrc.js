const path = require('path');

const buildEslintCommand = (filenames) =>
  `yarn pnpify next lint  -f mo --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};

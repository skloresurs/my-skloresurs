module.exports = {
  '**/*.(ts|tsx)': () => 'tsc --noEmit',
  '**/*.(ts|tsx|js)': (/** @type {string[]} */ filenames) => [
    `eslint -f=mo --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
  '**/*.(md|json|css)': (/** @type {string[]} */ filenames) => [
    `prettier --write ${filenames.join(' ')}`,
  ], 
};

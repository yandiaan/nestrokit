import baseConfig from '@repo/config/eslint/base';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      'import/prefer-default-export': 'off',
    },
  },
];

import nestConfig from '@repo/config/eslint/nest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nestConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      'import/prefer-default-export': 'off',
    },
  },
];

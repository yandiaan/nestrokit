import baseConfig from './base.js';
import globals from 'globals';

/**
 * ESLint configuration for NestJS projects
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // NestJS specific rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Allow empty functions for NestJS lifecycle hooks
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['constructors'] },
      ],

      // Console is often needed in backend
      'no-console': 'off',
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**'],
  },
];

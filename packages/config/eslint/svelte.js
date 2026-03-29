import baseConfig from './base.js';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
import globals from 'globals';

/**
 * ESLint configuration for Svelte projects
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...baseConfig,
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Svelte specific rules
      'svelte/no-at-html-tags': 'warn',
      'svelte/valid-compile': 'error',
      'svelte/no-unused-svelte-ignore': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/build/**',
      '**/.svelte-kit/**',
    ],
  },
];

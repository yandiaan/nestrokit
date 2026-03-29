import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      // OpenAPI spec URL - point to your running NestJS server
      target: 'http://localhost:3001/api/docs-json',
    },
    output: {
      // Output directory for generated files
      target: './src/generated/api.ts',
      // Schema to Zod validators
      schemas: './src/generated/schemas',
      // Use custom fetch client
      client: 'fetch',
      // Generate single file
      mode: 'single',
      // Clean output before generating
      clean: true,
      // Additional options
      override: {
        mutator: {
          path: './src/client.ts',
          name: 'customFetch',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

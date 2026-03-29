import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/fp/index.ts', 'src/common/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});

import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts', './src/util/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
});

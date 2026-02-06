import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/util/index.ts',
    './src/ui/index.ts',
    './src/ui/client-only/index.ts',
    './src/hooks/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
});

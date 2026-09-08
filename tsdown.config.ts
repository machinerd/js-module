import { defineConfig } from 'tsdown';
import pkg from './package.json' with { type: 'json' };

const external = Object.keys(pkg.peerDependencies || {});

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/editor/index.ts',
    './src/editor/nodes/*/index.ts',
    './src/editor/extensions/*/index.ts',
    './src/util/*/index.ts',
    './src/ui/*/index.ts',
    './src/ui/admin/*/index.ts',
    './src/hooks/*/index.ts',
    './src/providers/*/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  external: ['react/jsx-runtime', ...external],
});

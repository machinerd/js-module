import { defineConfig } from 'tsdown';
import pkg from './package.json' with { type: 'json' };

const external = Object.keys(pkg.peerDependencies || {});

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/util/browser.ts',
    './src/util/common.ts',
    './src/util/date.ts',
    './src/util/file.ts',
    './src/util/format.ts',
    './src/util/generator.ts',
    './src/util/phone.ts',
    './src/ui/index.ts',
    './src/ui/carousel/index.ts',
    './src/ui/dialog/index.ts',
    './src/ui/image/index.ts',
    './src/ui/sheet/index.ts',
    './src/ui/tooltip/index.ts',
    './src/hooks/index.ts',
    './src/providers/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  external: ['react/jsx-runtime', ...external],
});
